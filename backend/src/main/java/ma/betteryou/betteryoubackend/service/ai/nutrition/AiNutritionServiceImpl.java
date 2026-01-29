package ma.betteryou.betteryoubackend.service.ai.nutrition;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Nutrition.*;
import ma.betteryou.betteryoubackend.entity.nutrition.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.ContainsRepository;
import ma.betteryou.betteryoubackend.repository.NutritionPlanRepository;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.ComposedOfRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.FoodRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealRepository;
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

    private final OpenAiNutritionClient openAiNutritionClient;
    private final AiNutritionPromptBuilder promptBuilder;
    private final AiNutritionParser parser;

    private final UserRepository userRepository;
    private final NutritionPlanRepository nutritionPlanRepository;

    private final MealRepository mealRepository;
    private final FoodRepository foodRepository;
    private final ContainsRepository containsRepository;
    private final ComposedOfRepository composedOfRepository;

    @Value("${ai.openai.model:gpt-4o-mini}")
    private String aiModel;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ test endpoint /api/nutrition/ai/test
    @Override
    public String testJson() {
        return openAiNutritionClient.generateJson("""
            Return ONLY JSON: {"ok": true, "message": "hello from openai"}
        """);
    }

    @Override
    public AiNutritionGenerateResponse generate(AiNutritionGenerateRequest req) {

        if (req == null) throw new RuntimeException("Request body is required");
        if (req.getUserId() == null) throw new RuntimeException("userId is required");
        if (req.getStartDate() == null) throw new RuntimeException("startDate is required");
        if (req.getCaloriesPerDay() == null || req.getCaloriesPerDay() <= 0)
            throw new RuntimeException("caloriesPerDay must be > 0");

        // ✅ FORCER 7 jours
        LocalDate start = req.getStartDate();
        LocalDate endForced = start.plusDays(6);
        req.setEndDate(endForced);

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + req.getUserId()));

        String prompt = promptBuilder.build(req, user, endForced.toString());
        String aiJson = openAiNutritionClient.generateJson(prompt);

        AiNutritionAiResponse ai = parser.parse(aiJson);

        // ✅ validations
        if (ai.getDays() == null || ai.getDays().size() != 7) {
            throw new RuntimeException("AI must return exactly 7 days");
        }
        for (AiNutritionAiResponse.AiDay d : ai.getDays()) {
            if (d.getMeals() == null || d.getMeals().size() != 3) {
                throw new RuntimeException("Each day must contain exactly 3 meals (BREAKFAST, LUNCH, DINNER)");
            }
        }

        // ✅ persist (transaction courte)
        NutritionPlan plan = persistAll(req, user, ai);

        // ✅ return ALL DAYS to Postman
        List<AiDayPlanDto> daysDto = aiToDto(ai);

        return AiNutritionGenerateResponse.builder()
                .nutritionPlanId(plan.getIdNutrition())
                .nutritionName(plan.getNutritionName())
                .objective(plan.getObjective())
                .caloriesPerDay(plan.getCaloriesPerDay())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .generated(true)
                .aiModel(aiModel)
                .days(daysDto)
                .build();
    }

    /**
     * ✅ Transaction courte: DB only
     * ✅ IMPORTANT: insert Meal via SQL native CAST(:prepSteps AS jsonb)
     */
    @Transactional(timeout = 60)
    protected NutritionPlan persistAll(AiNutritionGenerateRequest req, User user, AiNutritionAiResponse ai) {

        String planName = (ai.getNutritionName() != null && !ai.getNutritionName().isBlank())
                ? ai.getNutritionName()
                : "AI " + safe(req.getObjective());

        NutritionPlan plan = NutritionPlan.builder()
                .nutritionName(planName)
                .objective(safe(ai.getObjective(), req.getObjective()))
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .caloriesPerDay(ai.getCaloriesPerDay() != null ? ai.getCaloriesPerDay() : req.getCaloriesPerDay())
                .description("Generated by AI (" + aiModel + ")")
                .user(user)
                .build();

        plan = nutritionPlanRepository.save(plan);

        for (AiNutritionAiResponse.AiDay day : ai.getDays()) {
            String dow = normalizeDay(day.getDayOfWeek());

            for (AiNutritionAiResponse.AiMeal m : day.getMeals()) {
                String slot = normalizeSlot(m.getMealSlot());
                String mealName = (m.getMealName() == null || m.getMealName().isBlank())
                        ? slot + " Meal" : m.getMealName();

                // ✅ preparationSteps -> JSON string
                String prepJson = toJsonArrayString(m.getPreparationSteps());

                // ✅ INSERT Meal with CAST jsonb
                Long mealId = mealRepository.insertMealReturningId(
                        m.getDescription(), // description
                        null,               // food_preferences
                        null,               // goal
                        null,               // image_url
                        mealName,           // meal_name
                        null,               // meal_status
                        slot,               // meal_type
                        prepJson            // preparation_steps JSON => CAST(... AS jsonb)
                );

                // ✅ fetch Meal entity to use in relations
                Meal meal = mealRepository.findById(mealId)
                        .orElseThrow(() -> new RuntimeException("Meal not found after insert: " + mealId));

                // ✅ items -> FoodItem + Contains
                if (m.getItems() != null) {
                    for (AiNutritionAiResponse.AiItem it : m.getItems()) {
                        if (it == null || it.getFoodName() == null || it.getFoodName().isBlank()) continue;

    FoodItem food = foodRepository
        .findFirstByFoodNameIgnoreCase(it.getFoodName())
        .orElseGet(() -> {
            // ✅ defaults to satisfy NOT NULL constraints
            return foodRepository.save(
                    FoodItem.builder()
                            .foodName(it.getFoodName())
                            .description("AI generated placeholder")
                            .caloriesPer100g(BigDecimal.valueOf(100))   // default
                            .proteinsPer100g(BigDecimal.valueOf(5))     // default
                            .carbsPer100g(BigDecimal.valueOf(10))       // default
                            .fatsPer100g(BigDecimal.valueOf(5))         // default
                            .build()
            );
        });


                        Contains contains = Contains.builder()
                                .id(new ContainsId(meal.getIdMeal(), food.getIdFood()))
                                .meal(meal)
                                .foodItem(food)
                                .quantityGrams(it.getQuantityGrams() == null ? null : BigDecimal.valueOf(it.getQuantityGrams()))
                                .build();

                        containsRepository.save(contains);
                    }
                }

                // ✅ link plan<->meal for a day
                composedOfRepository.save(
                        ComposedOf.builder()
                                .id(new ComposedOfId(plan.getIdNutrition(), meal.getIdMeal(), dow))
                                .nutritionPlan(plan)
                                .meal(meal)
                                .mealSlot(slot)
                                .build()
                );
            }
        }

        return plan;
    }

    @Override
    public List<AiDayPlanDto> getWeek(Long planId) {
        List<ComposedOf> links = composedOfRepository.findByNutritionPlan_IdNutrition(planId);

        Map<String, List<ComposedOf>> byDay = links.stream()
                .collect(Collectors.groupingBy(c -> c.getId().getDayOfWeek()));

        List<String> orderedDays = List.of("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
        List<AiDayPlanDto> out = new ArrayList<>();

        for (String d : orderedDays) {
            List<ComposedOf> dayLinks = byDay.getOrDefault(d, List.of());
            out.add(buildDayDto(d, dayLinks));
        }
        return out;
    }

    @Override
    public AiDayPlanDto getDay(Long planId, String dayOfWeek) {
        String d = normalizeDay(dayOfWeek);
        List<ComposedOf> links = composedOfRepository.findByNutritionPlan_IdNutritionAndId_DayOfWeek(planId, d);
        return buildDayDto(d, links);
    }

    // ================= helpers mapping =================

    private AiDayPlanDto buildDayDto(String day, List<ComposedOf> links) {
        Map<String,Integer> order = Map.of("BREAKFAST",1,"LUNCH",2,"DINNER",3,"SNACK",4);
        links.sort(Comparator.comparing(c -> order.getOrDefault(c.getMealSlot(), 99)));

        List<AiMealDto> meals = links.stream().map(c -> {
            Meal meal = c.getMeal();
            List<AiMealItemDto> items = containsRepository.findByMeal_IdMeal(meal.getIdMeal()).stream()
                    .map(ct -> AiMealItemDto.builder()
                            .foodName(ct.getFoodItem().getFoodName())
                            .quantityGrams(ct.getQuantityGrams())
                            .build())
                    .collect(Collectors.toList());

            // meal.getPreparationSteps() est String (entity), on convertit String JSON -> List<String>
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
        return ai.getDays().stream().map(d ->
                AiDayPlanDto.builder()
                        .dayOfWeek(normalizeDay(d.getDayOfWeek()))
                        .meals(d.getMeals().stream().map(m ->
                                AiMealDto.builder()
                                        .mealSlot(normalizeSlot(m.getMealSlot()))
                                        .mealName(m.getMealName())
                                        .description(m.getDescription())
                                        .preparationSteps(m.getPreparationSteps())
                                        .items(m.getItems().stream().map(it ->
                                                AiMealItemDto.builder()
                                                        .foodName(it.getFoodName())
                                                        .quantityGrams(it.getQuantityGrams() == null ? null : BigDecimal.valueOf(it.getQuantityGrams()))
                                                        .build()
                                        ).collect(Collectors.toList()))
                                        .build()
                        ).collect(Collectors.toList()))
                        .build()
        ).collect(Collectors.toList());
    }

    private String safe(String v) { return v == null ? "UNKNOWN" : v; }
    private String safe(String a, String b) { return (a != null && !a.isBlank()) ? a : safe(b); }

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
        if (Set.of("BREAKFAST","LUNCH","DINNER","SNACK").contains(x)) return x;
        return "DINNER";
    }

    // ✅ returns JSON array string
    private String toJsonArrayString(List<String> steps) {
        try { return steps == null ? "[]" : objectMapper.writeValueAsString(steps); }
        catch (Exception e) { return "[]"; }
    }

    private List<String> parseJsonArrayString(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
