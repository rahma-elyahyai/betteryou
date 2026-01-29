package ma.betteryou.betteryoubackend.service.ai.nutrition;

import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateRequest;
import ma.betteryou.betteryoubackend.entity.user.User;
import org.springframework.stereotype.Component;

@Component
public class AiNutritionPromptBuilder {

    public String build(AiNutritionGenerateRequest req, User user, String forcedEndDate) {

        return """
You are a nutrition program generator.
Return STRICT JSON only (no markdown, no extra text, no commentary).

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
- food_preferences: %s

OUTPUT JSON SCHEMA EXACTLY:
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
          "mealSlot": "BREAKFAST|LUNCH|DINNER",
          "mealName": "string",
          "description": "string",
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
   BREAKFAST, LUNCH, DINNER (no SNACK in this version).
3) Each meal MUST contain at least 2 items.
4) quantityGrams MUST be a realistic number (30-400).
5) Use simple common foods (oats, rice, chicken, eggs, milk, broccoli, banana, olive oil, tuna, yogurt, etc.)
6) Ensure variety across the week (do not repeat same meal every day).
7) Output must be ONE JSON object and parseable.
""".formatted(
                safe(req.getObjective()),
                req.getCaloriesPerDay(),
                req.getStartDate(),
                forcedEndDate,
                safe(user.getGender() != null ? user.getGender().name() : null),
                user.getHeightCm(),
                user.getInitialWeightKg(),
                safe(user.getActivityLevel() != null ? user.getActivityLevel().name() : null),
                safe(user.getFitnessLevel() != null ? user.getFitnessLevel().name() : null),
                safe(user.getFoodPreferences() != null ? user.getFoodPreferences().name() : null)
        );
    }

    private String safe(String v) {
        return v == null ? "UNKNOWN" : v;
    }
}
