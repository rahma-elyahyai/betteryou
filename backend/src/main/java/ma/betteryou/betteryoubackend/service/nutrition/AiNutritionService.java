package ma.betteryou.betteryoubackend.service.nutrition;

import ma.betteryou.betteryoubackend.dto.nutrition.*;
import ma.betteryou.betteryoubackend.dto.nutrition.ai.*;

import java.util.List;

public interface AiNutritionService {
    AiNutritionGenerateResponse generate(AiNutritionGenerateRequest req);

    List<NutritionPlanDto> getPlansByUser(Long userId);

    NutritionPlanDto getPlan(Long planId);

    List<MealDto> getMealsByDay(Long planId, String dayOfWeek);
}
