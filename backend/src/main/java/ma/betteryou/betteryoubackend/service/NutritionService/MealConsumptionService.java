package ma.betteryou.betteryoubackend.service.NutritionService;

import ma.betteryou.betteryoubackend.dto.Nutrition.MealConsumptionDto;

public interface MealConsumptionService {
    MealConsumptionDto recordMealConsumption(Long userId, Long mealId, java.time.LocalDate consumptionDate, Integer servings);
}
