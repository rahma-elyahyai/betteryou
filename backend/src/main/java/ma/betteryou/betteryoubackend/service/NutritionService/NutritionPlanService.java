package ma.betteryou.betteryoubackend.service.NutritionService;

import ma.betteryou.betteryoubackend.dto.Nutrition.NutritionPlanDto;
import java.util.List;

public interface NutritionPlanService {

    List<NutritionPlanDto> getNutritionPlanByUserId(Long idUser, String dayOfWeek);
    NutritionPlanDto saveNutritionPlanDto(NutritionPlanDto nutritionPlanDto);
    NutritionPlanDto addMealToNutritionPlan(Long idNutritionPlan, Long idMeal, String dayOfWeek, String mealSlot);
    void removeMealFromPlan(Long idNutritionPlan, Long idMeal, String dayOfWeek, String mealSlot);
    void updateNutritionPlan( Long idNutrition,NutritionPlanDto planDto );
    void deletePlan(Long idNutrition);
    NutritionPlanDto replaceMealInPlan(Long idNutritionPlan, Long oldMealId, Long newMealId, String dayOfWeek, String mealSlot);
}

