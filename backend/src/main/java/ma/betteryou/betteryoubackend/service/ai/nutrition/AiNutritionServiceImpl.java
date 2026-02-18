package ma.betteryou.betteryoubackend.service.ai.nutrition;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Nutrition.*;
import ma.betteryou.betteryoubackend.entity.nutrition.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.FoodPreferences;
import ma.betteryou.betteryoubackend.entity.enums.SessionStatus;
import ma.betteryou.betteryoubackend.repository.ContainsRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.ComposedOfRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.FoodRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealRepository;
import ma.betteryou.betteryoubackend.repository.NutritionPlanRepository;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiNutritionServiceImpl implements AiNutritionService {

    private final OpenAiNutritionClient openAiNutritionClient;
    private final AiNutritionPromptBuilder promptBuilder;
    private final AiNutritionParser parser;

    private final UserRepository userRepository;
    private final NutritionPlanRepository nutritionPlanRepository;

    private final MealRepository mealRepository;
    private final FoodRepository foodRepository;
    private final ContainsRepository containsRepository;
    private final ComposedOfRepository composedOfRepository;
    private final EntityManager entityManager;

    @Value("${ai.openai.model:gpt-4o-mini}")
    private String aiModel;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String testJson() {
        return openAiNutritionClient.generateJson("""
                    Return ONLY JSON: {"ok": true, "message": "hello from openai"}
                """);
    }

    @Override
    @Transactional(timeout = 1200)
    public AiNutritionGenerateResponse generate(AiNutritionGenerateRequest req) {
        if (req == null)
            throw new RuntimeException("Request body is required");
        if (req.getUserId() == null)
            throw new RuntimeException("userId is required");
        if (req.getStartDate() == null)
            throw new RuntimeException("startDate is required");
        if (req.getCaloriesPerDay() == null || req.getCaloriesPerDay() <= 0)
            throw new RuntimeException("caloriesPerDay must be > 0");

        LocalDate start = req.getStartDate();
        req.setEndDate(start.plusDays(6));

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + req.getUserId()));
                
        // ✅ TERMINER LES ANCIENS PLANS ACTIFS (même logique que la création manuelle)
        List<NutritionPlan> activePlans = nutritionPlanRepository
                .findByUser_IdUser(user.getIdUser())
                .stream()
                .filter(plan -> !plan.getEndDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());

        for (NutritionPlan oldPlan : activePlans) {
            oldPlan.setEndDate(LocalDate.now().minusDays(1));
            nutritionPlanRepository.save(oldPlan);
            System.out.println("⚠️ Auto-terminated old plan: " + oldPlan.getIdNutrition()
                    + " [" + oldPlan.getNutritionName() + "]");
        }

        String prompt = promptBuilder.build(req, user, req.getEndDate().toString());
        String aiJson = openAiNutritionClient.generateJson(prompt);
        AiNutritionAiResponse ai = parser.parse(aiJson);

        if (ai.getDays() == null || ai.getDays().size() != 7)
            throw new RuntimeException("AI must return exactly 7 days");

        NutritionPlan plan = persistAll(req, user, ai);

        return AiNutritionGenerateResponse.builder()
                .nutritionPlanId(plan.getIdNutrition())
                .nutritionName(plan.getNutritionName())
                .objective(plan.getObjective())
                .caloriesPerDay(plan.getCaloriesPerDay())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .generated(true)
                .aiModel(aiModel)
                .days(aiToDto(ai))
                .build();
    }

    protected NutritionPlan persistAll(AiNutritionGenerateRequest req, User user, AiNutritionAiResponse ai) {
        NutritionPlan plan = NutritionPlan.builder()
        .nutritionName(req.getNutritionName())
        .objective(req.getObjective())
        .startDate(req.getStartDate())
        .endDate(req.getEndDate())
        .caloriesPerDay(req.getCaloriesPerDay())
        .description("Generated by AI (" + aiModel + ")")
        .user(user)
        .build();


        plan = nutritionPlanRepository.save(plan);

        for (AiNutritionAiResponse.AiDay day : ai.getDays()) {
            String dow = normalizeDay(day.getDayOfWeek());

            for (AiNutritionAiResponse.AiMeal m : day.getMeals()) {
                saveMealTransactional(plan, dow, m);
            }
        }

        return plan;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, timeout = 300)
    protected void saveMealTransactional(NutritionPlan plan, String dow, AiNutritionAiResponse.AiMeal m) {
        String slot = normalizeSlot(m.getMealSlot());

        String mealName = safe(m.getMealName(), "AI Meal");
        String description = safe(m.getDescription(), "Generated by AI");
        String mealType = slot;
        String imageUrl = null;
        String goalName = Goal.MAINTAIN != null ? Goal.MAINTAIN.name() : null;
        String foodPrefName = FoodPreferences.NONE != null ? FoodPreferences.NONE.name() : null;
        String mealStatusName = SessionStatus.PLANNED != null ? SessionStatus.PLANNED.name() : null;

        Number generatedId = (Number) entityManager.createNativeQuery("""
                    INSERT INTO meal (description, food_preferences, goal, image_url, meal_name, meal_status, meal_type)
                    VALUES (:description, :foodPreferences, :goal, :imageUrl, :mealName, :mealStatus, :mealType)
                    RETURNING id_meal
                """)
                .setParameter("description", description)
                .setParameter("foodPreferences", foodPrefName)
                .setParameter("goal", goalName)
                .setParameter("imageUrl", imageUrl)
                .setParameter("mealName", mealName)
                .setParameter("mealStatus", mealStatusName)
                .setParameter("mealType", mealType)
                .getSingleResult();

        Long mealId = generatedId.longValue();
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Inserted meal not found: " + mealId));

        if (m.getPreparationSteps() != null && !m.getPreparationSteps().isEmpty()) {
            String jsonSteps = toJsonArrayString(m.getPreparationSteps());

            entityManager.createNativeQuery("""
                        UPDATE meal
                        SET preparation_steps = CAST(:steps AS jsonb)
                        WHERE id_meal = :mealId
                    """)
                    .setParameter("steps", jsonSteps)
                    .setParameter("mealId", meal.getIdMeal())
                    .executeUpdate();
        }

        if (m.getItems() != null) {
            for (AiNutritionAiResponse.AiItem it : m.getItems()) {
                if (it == null || it.getFoodName() == null || it.getFoodName().isBlank())
                    continue;

                FoodItem food = foodRepository.findAll().stream()
                        .filter(f -> f.getFoodName().equalsIgnoreCase(it.getFoodName()))
                        .findFirst()
                        .orElseGet(() -> foodRepository.save(FoodItem.builder()
                                .foodName(it.getFoodName())
                                .description("AI generated")
                                .caloriesPer100g(BigDecimal.valueOf(100))
                                .proteinsPer100g(BigDecimal.valueOf(5))
                                .carbsPer100g(BigDecimal.valueOf(10))
                                .fatsPer100g(BigDecimal.valueOf(5))
                                .build()));

                containsRepository.save(Contains.builder()
                        .id(new ContainsId(meal.getIdMeal(), food.getIdFood()))
                        .meal(meal)
                        .foodItem(food)
                        .quantityGrams(it.getQuantityGrams() == null ? BigDecimal.valueOf(100)
                                : BigDecimal.valueOf(it.getQuantityGrams()))
                        .build());
            }
        }

        composedOfRepository.save(ComposedOf.builder()
                .id(new ComposedOfId(plan.getIdNutrition(), meal.getIdMeal(), dow))
                .nutritionPlan(plan)
                .meal(meal)
                .mealSlot(slot != null ? slot : "DINNER")
                .build());
    }

    // ================= GET =================

    @Override
    public List<AiDayPlanDto> getWeek(Long planId) {
        List<ComposedOf> links = composedOfRepository.findAll().stream()
                .filter(c -> c.getNutritionPlan().getIdNutrition().equals(planId))
                .toList();

        Map<String, List<ComposedOf>> byDay = links.stream()
                .collect(Collectors.groupingBy(c -> c.getId().getDayOfWeek()));

        List<String> orderedDays = List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
                "Sunday");

        List<AiDayPlanDto> out = new ArrayList<>();
        for (String d : orderedDays) {
            out.add(buildDayDto(d, byDay.getOrDefault(d, List.of())));
        }
        return out;
    }

    @Override
    public AiDayPlanDto getDay(Long planId, String dayOfWeek) {
        String d = normalizeDay(dayOfWeek);

        List<ComposedOf> links = composedOfRepository.findAll().stream()
                .filter(c -> c.getNutritionPlan().getIdNutrition().equals(planId)
                        && c.getId().getDayOfWeek().equals(d))
                .toList();

        return buildDayDto(d, links);
    }

    // ================= MAPPING =================

    private AiDayPlanDto buildDayDto(String day, List<ComposedOf> links) {
        Map<String, Integer> order = Map.of("BREAKFAST", 1, "LUNCH", 2, "DINNER", 3, "SNACK", 4);

        links.sort(Comparator.comparing(c -> order.getOrDefault(c.getMealSlot(), 99)));

        List<AiMealDto> meals = links.stream().map(c -> {
            Meal meal = c.getMeal();
            List<AiMealItemDto> items = meal.getContains().stream()
                    .map(ct -> AiMealItemDto.builder()
                            .foodName(ct.getFoodItem().getFoodName())
                            .quantityGrams(ct.getQuantityGrams())
                            .build())
                    .collect(Collectors.toList());

            return AiMealDto.builder()
                    .mealSlot(c.getMealSlot())
                    .mealName(meal.getMealName())
                    .description(meal.getDescription())
                    .preparationSteps(parseJsonArrayString(meal.getPreparationSteps()))
                    .items(items)
                    .build();
        }).collect(Collectors.toList());

        return AiDayPlanDto.builder()
                .dayOfWeek(day)
                .meals(meals)
                .build();
    }

    private List<AiDayPlanDto> aiToDto(AiNutritionAiResponse ai) {
        return ai.getDays().stream().map(d -> AiDayPlanDto.builder()
                .dayOfWeek(normalizeDay(d.getDayOfWeek()))
                .meals(d.getMeals().stream().map(m -> AiMealDto.builder()
                        .mealSlot(normalizeSlot(m.getMealSlot()))
                        .mealName(m.getMealName())
                        .description(m.getDescription())
                        .preparationSteps(m.getPreparationSteps())
                        .items(m.getItems().stream().map(it -> AiMealItemDto.builder()
                                .foodName(it.getFoodName())
                                .quantityGrams(it.getQuantityGrams() == null ? null
                                        : BigDecimal.valueOf(it.getQuantityGrams()))
                                .build()).collect(Collectors.toList()))
                        .build()).collect(Collectors.toList()))
                .build()).collect(Collectors.toList());
    }

    // ================= HELPERS =================

    private String safe(String v) {
        return v == null ? "UNKNOWN" : v;
    }

    private String safe(String a, String b) {
        return (a != null && !a.isBlank()) ? a : safe(b);
    }

    private String normalizeDay(String d) {
        if (d == null || d.isBlank())
            return "Monday";
        String x = d.trim().toLowerCase();
        if (x.startsWith("mon"))
            return "Monday";
        if (x.startsWith("tue"))
            return "Tuesday";
        if (x.startsWith("wed"))
            return "Wednesday";
        if (x.startsWith("thu"))
            return "Thursday";
        if (x.startsWith("fri"))
            return "Friday";
        if (x.startsWith("sat"))
            return "Saturday";
        if (x.startsWith("sun"))
            return "Sunday";
        if (x.isEmpty())
            return "Monday";
        return Character.toUpperCase(x.charAt(0)) + x.substring(1);
    }

    private String normalizeSlot(String s) {
        if (s == null || s.isBlank())
            return "DINNER";
        String x = s.trim().toUpperCase();
        if (Set.of("BREAKFAST", "LUNCH", "DINNER", "SNACK").contains(x))
            return x;
        return "DINNER";
    }

    private String toJsonArrayString(List<String> steps) {
        try {
            return steps == null ? "[]" : objectMapper.writeValueAsString(steps);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<String> parseJsonArrayString(String json) {
        try {
            if (json == null || json.isBlank())
                return List.of();
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
