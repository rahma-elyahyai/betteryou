package ma.betteryou.betteryoubackend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.nutrition.MealDto;
import ma.betteryou.betteryoubackend.dto.nutrition.MealItemDto;
import ma.betteryou.betteryoubackend.dto.nutrition.NutritionPlanDto;
import ma.betteryou.betteryoubackend.dto.nutrition.ai.AiNutritionGenerateRequest;
import ma.betteryou.betteryoubackend.dto.nutrition.ai.AiNutritionGenerateResponse;
import ma.betteryou.betteryoubackend.entity.nutrition.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.repository.nutrition.*;
import ma.betteryou.betteryoubackend.service.ai.AiClient;
import ma.betteryou.betteryoubackend.service.ai.AiNutritionAiResponse;
import ma.betteryou.betteryoubackend.service.ai.AiNutritionParser;
import ma.betteryou.betteryoubackend.service.ai.AiNutritionPromptBuilder;
import ma.betteryou.betteryoubackend.service.nutrition.AiNutritionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiNutritionServiceImpl implements AiNutritionService {

    private final UserRepository userRepository;
    private final NutritionPlanRepository nutritionPlanRepository;
    private final MealRepository mealRepository;
    private final FoodRepository foodRepository;
    private final ContainsRepository containsRepository;
    private final ComposedOfRepository composedOfRepository;

    private final AiClient aiClient;
    private final AiNutritionPromptBuilder promptBuilder;
    private final AiNutritionParser parser;

        @Value("${ai.provider:github-models}")
        private String aiProvider;

        @Value("${ai.model:unknown}")
        private String aiModel;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * ✅ PAS de @Transactional ici.
     * Car l'appel IA + parsing peut être long => Neon/Ollama peuvent causer un timeout.
     */
    @Override
    public AiNutritionGenerateResponse generate(AiNutritionGenerateRequest req) {

        // ======= BASIC VALIDATIONS =======
        if (req == null) throw new RuntimeException("Request body is required");
        if (req.getUserId() == null) throw new RuntimeException("userId is required");
        if (req.getStartDate() == null || req.getEndDate() == null)
            throw new RuntimeException("startDate and endDate are required");
        if (req.getCaloriesPerDay() == null || req.getCaloriesPerDay() <= 0)
            throw new RuntimeException("caloriesPerDay must be > 0");

        System.out.println(">>> [AI] generate() START userId=" + req.getUserId());

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + req.getUserId()));

        // ======= 1) PROMPT + IA =======
        String prompt = promptBuilder.buildPrompt(req, user);
        System.out.println(">>> [AI] prompt built, length=" + (prompt == null ? 0 : prompt.length()));

        System.out.println(">>> [AI] calling provider=" + aiProvider + " model=" + aiModel);
        String aiJson = aiClient.generateJson(prompt);

        System.out.println(">>> [AI] AI returned json length=" + (aiJson == null ? 0 : aiJson.length()));
        System.out.println("===== AI RAW START =====");
        System.out.println(aiJson);
        System.out.println("===== AI RAW END =====");

        // ======= 2) PARSE JSON -> OBJ =======
        AiNutritionAiResponse ai = parser.parse(aiJson);
        System.out.println(">>> [AI] parsed OK days=" + (ai.getDays() == null ? 0 : ai.getDays().size()));

        // ======= 3) VALIDATE LOGIC =======
        if (ai.getDays() == null || ai.getDays().size() != 7) {
            throw new RuntimeException("AI must return exactly 7 days, got: "
                    + (ai.getDays() == null ? 0 : ai.getDays().size()));
        }

        // ======= 4) DB PERSIST (short transaction) =======
        NutritionPlan plan = persistPlan(req, user, ai);

        System.out.println(">>> [AI] generate() END");

        // ======= 5) RESPONSE =======
        return AiNutritionGenerateResponse.builder()
                .nutritionPlanId(plan.getIdNutrition())
                .nutritionName(plan.getNutritionName())
                .objective(plan.getObjective())
                .caloriesPerDay(plan.getCaloriesPerDay())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .generated(true)
                .generationSource(aiProvider.toUpperCase())
                .aiModel(aiModel)
                .build();
    }

    /**
     * ✅ Transaction courte: uniquement DB
     * ✅ timeout: évite que Postgres garde une transaction trop longtemps.
     */
    @Transactional(timeout = 60)
    protected NutritionPlan persistPlan(AiNutritionGenerateRequest req, User user, AiNutritionAiResponse ai) {

        String planName = (ai.getNutritionName() != null && !ai.getNutritionName().isBlank())
                ? ai.getNutritionName()
                : buildPlanName(req.getObjective());

        String objective = (ai.getObjective() != null && !ai.getObjective().isBlank())
                ? ai.getObjective()
                : req.getObjective();

        LocalDate startDate = (ai.getStartDate() != null && !ai.getStartDate().isBlank())
                ? LocalDate.parse(ai.getStartDate())
                : req.getStartDate();

        LocalDate endDate = (ai.getEndDate() != null && !ai.getEndDate().isBlank())
                ? LocalDate.parse(ai.getEndDate())
                : req.getEndDate();

        Integer calories = ai.getCaloriesPerDay() != null ? ai.getCaloriesPerDay() : req.getCaloriesPerDay();

        NutritionPlan plan = NutritionPlan.builder()
                .nutritionName(planName)
                .objective(objective)
                .startDate(startDate)
                .endDate(endDate)
                .caloriesPerDay(calories)
                .description("Generated by AI (" + aiProvider.toUpperCase() + ")")
                .user(user)
                .build();

        plan = nutritionPlanRepository.save(plan);
        System.out.println(">>> [AI] plan saved id=" + plan.getIdNutrition());

        // Persist meals & relations
        for (AiNutritionAiResponse.AiDay day : ai.getDays()) {

            if (day == null) continue;

            String dayOfWeek = normalizeDay(day.getDayOfWeek());
            if (day.getMeals() == null || day.getMeals().isEmpty()) continue;

            for (AiNutritionAiResponse.AiMeal m : day.getMeals()) {

                if (m == null) continue;

                String mealSlot = normalizeSlot(m.getMealSlot());
                String mealType = (m.getMealType() != null && !m.getMealType().isBlank())
                        ? m.getMealType()
                        : mealSlot;

                String mealName = (m.getMealName() == null || m.getMealName().isBlank())
                        ? (mealSlot + " Meal")
                        : m.getMealName();

                Meal meal = mealRepository.save(
                        Meal.builder()
                                .mealName(mealName)
                                .mealType(mealType)
                                .description(m.getDescription())
                                .imageUrl(m.getImageUrl())
                                .preparationSteps(toJsonArrayString(m.getPreparationSteps()))
                                .build()
                );

                if (m.getItems() != null && !m.getItems().isEmpty()) {
                    for (AiNutritionAiResponse.AiItem it : m.getItems()) {
                        if (it == null) continue;
                        if (it.getFoodName() == null || it.getFoodName().isBlank()) continue;

                        FoodItem food = foodRepository
                                .findAllByFoodNameIgnoreCaseOrderByIdFoodAsc(it.getFoodName())
                                .stream()
                                .findFirst()
                                .orElseGet(() ->
                                        foodRepository.save(
                                                FoodItem.builder().foodName(it.getFoodName()).build()
                                        )
                                );

                        Contains contains = Contains.builder()
                                .id(new ContainsId(meal.getIdMeal(), food.getIdFood()))
                                .meal(meal)
                                .foodItem(food)
                                .quantityGrams(
                                        it.getQuantityGrams() == null
                                                ? null
                                                : BigDecimal.valueOf(it.getQuantityGrams())
                                )
                                .build();

                        containsRepository.save(contains);
                    }
                }

                composedOfRepository.save(
                        ComposedOf.builder()
                                .id(new ComposedOfId(plan.getIdNutrition(), meal.getIdMeal(), dayOfWeek))
                                .nutritionPlan(plan)
                                .meal(meal)
                                .mealSlot(mealSlot)
                                .build()
                );
            }
        }

        System.out.println(">>> [AI] persistPlan() DONE");
        return plan;
    }

    // ================== GETTERS ==================

    @Override
    public List<NutritionPlanDto> getPlansByUser(Long userId) {
        return nutritionPlanRepository.findByUser_IdUser(userId)
                .stream()
                .map(this::toPlanDto)
                .collect(Collectors.toList());
    }

    @Override
    public NutritionPlanDto getPlan(Long planId) {
        NutritionPlan p = nutritionPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Nutrition plan not found: " + planId));
        return toPlanDto(p);
    }

    @Override
    public List<MealDto> getMealsByDay(Long planId, String dayOfWeek) {

        String normalizedDay = normalizeDay(dayOfWeek);

        List<ComposedOf> links = composedOfRepository
                .findByNutritionPlan_IdNutritionAndId_DayOfWeek(planId, normalizedDay);

        Map<String, Integer> order = Map.of(
                "BREAKFAST", 1,
                "LUNCH", 2,
                "DINNER", 3,
                "SNACK", 4
        );

        links.sort(Comparator.comparing(c -> order.getOrDefault(c.getMealSlot(), 99)));

        return links.stream().map(c -> {
            Meal meal = c.getMeal();

            List<MealItemDto> items = containsRepository.findByMeal_IdMeal(meal.getIdMeal())
                    .stream()
                    .map(ct -> MealItemDto.builder()
                            .idFood(ct.getFoodItem().getIdFood())
                            .foodName(ct.getFoodItem().getFoodName())
                            .quantityGrams(ct.getQuantityGrams())
                            .build())
                    .collect(Collectors.toList());

            return MealDto.builder()
                    .idMeal(meal.getIdMeal())
                    .mealName(meal.getMealName())
                    .mealType(meal.getMealType())
                    .mealSlot(c.getMealSlot())
                    .dayOfWeek(c.getId().getDayOfWeek())
                    .description(meal.getDescription())
                    .items(items)
                    .build();
        }).collect(Collectors.toList());
    }

    // ================== HELPERS ==================

    private NutritionPlanDto toPlanDto(NutritionPlan p) {
        return NutritionPlanDto.builder()
                .idNutrition(p.getIdNutrition())
                .nutritionName(p.getNutritionName())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .objective(p.getObjective())
                .description(p.getDescription())
                .caloriesPerDay(p.getCaloriesPerDay())
                .build();
    }

    private String buildPlanName(String objective) {
        return objective == null ? "Nutrition Plan" : "AI " + objective.replace("_", " ");
    }

    private String normalizeDay(String d) {
        if (d == null || d.isBlank()) return "Monday";
        String x = d.trim().toLowerCase();
        if (x.startsWith("mon")) return "Monday";
        if (x.startsWith("tue")) return "Tuesday";
        if (x.startsWith("wed")) return "Wednesday";
        if (x.startsWith("thu")) return "Thursday";
        if (x.startsWith("fri")) return "Friday";
        if (x.startsWith("sat")) return "Saturday";
        if (x.startsWith("sun")) return "Sunday";
        return Character.toUpperCase(x.charAt(0)) + x.substring(1);
    }

    private String normalizeSlot(String s) {
        if (s == null || s.isBlank()) return "DINNER";
        String x = s.trim().toUpperCase();
        if (Set.of("BREAKFAST", "LUNCH", "DINNER", "SNACK").contains(x)) return x;
        return "DINNER";
    }

    private String toJsonArrayString(List<String> steps) {
        try {
            return steps == null ? "[]" : objectMapper.writeValueAsString(steps);
        } catch (Exception e) {
            return "[]";
        }
    }
}
