package ma.betteryou.betteryoubackend.service.ai.nutrition;

import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateRequest;
import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateResponse;

public interface AiNutritionGenerateService {
    AiNutritionGenerateResponse generate(AiNutritionGenerateRequest req);
}
