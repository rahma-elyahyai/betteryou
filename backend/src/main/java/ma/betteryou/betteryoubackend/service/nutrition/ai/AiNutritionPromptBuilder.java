package ma.betteryou.betteryoubackend.service.ai;

import ma.betteryou.betteryoubackend.dto.nutrition.ai.AiNutritionGenerateRequest;
import ma.betteryou.betteryoubackend.entity.user.User;
import org.springframework.stereotype.Component;

@Component
public class AiNutritionPromptBuilder {

    public String buildPrompt(AiNutritionGenerateRequest req, User user) {

        return """
        You are a nutrition program generator.
        Return STRICT JSON only (no markdown, no extra text, no commentary).
        Do NOT wrap the JSON in triple backticks.
        Do NOT output explanations.

        Goal/objective: %s
        Calories per day: %s
        Start date: %s
        End date: %s

        User profile:
        - gender: %s
        - height_cm: %s
        - initial_weight_kg: %s
        - activity_level: %s
        - fitness_level: %s

        Output JSON schema EXACTLY (valid JSON):
        {
          "nutritionName": "string",
          "objective": "string",
          "caloriesPerDay": number,
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD",
          "days": [
            {
              "dayOfWeek": "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday",
              "meals": [
                {
                  "mealSlot": "BREAKFAST|LUNCH|DINNER|SNACK",
                  "mealType": "BREAKFAST|LUNCH|DINNER|SNACK",
                  "mealName": "string",
                  "description": "string or null",
                  "imageUrl": "string or null",
                  "preparationSteps": ["step1","step2"],
                  "items": [
                    { "foodName": "string", "quantityGrams": number }
                  ]
                }
              ]
            }
          ]
        }

        HARD RULES (MUST FOLLOW):
        1) "days" MUST contain EXACTLY 7 objects, in THIS ORDER:
           Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
        2) Each day MUST contain EXACTLY 3 meals with mealSlot:
           BREAKFAST, LUNCH, DINNER (no missing day, no empty meals array).
        3) Each meal MUST contain at least 2 items.
        4) quantityGrams MUST be a number (realistic, e.g. 30-400).
        5) Use simple common foods (e.g. oats, rice, chicken breast, eggs, milk, broccoli, banana, olive oil).
        6) Ensure variety across the week (do not repeat the same meals every day).
        7) The output must be a single JSON object and must be parseable by standard JSON parser.
        """.formatted(
                safe(req.getObjective()),
                req.getCaloriesPerDay(),
                req.getStartDate(),
                req.getEndDate(),
                safe(user.getGender() != null ? user.getGender().name() : null),
                user.getHeightCm(),
                user.getInitialWeightKg(),
                safe(user.getActivityLevel() != null ? user.getActivityLevel().name() : null),
                safe(user.getFitnessLevel() != null ? user.getFitnessLevel().name() : null)
        );
    }

    private String safe(String v) {
        return v == null ? "UNKNOWN" : v;
    }
}
