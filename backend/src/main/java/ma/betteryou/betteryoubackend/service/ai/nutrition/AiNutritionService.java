package ma.betteryou.betteryoubackend.service.ai.nutrition;

import ma.betteryou.betteryoubackend.dto.Nutrition.AiDayPlanDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateRequest;
import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateResponse;

import java.util.List;

public interface AiNutritionService {

    // ✅ test rapide OpenAI (pour AiNutritionTestController)
    String testJson();

    // ✅ génération complète + sauvegarde + retour semaine
    AiNutritionGenerateResponse generate(AiNutritionGenerateRequest req);

    // ✅ lire semaine depuis DB
    List<AiDayPlanDto> getWeek(Long planId);

    // ✅ lire un seul jour depuis DB
    AiDayPlanDto getDay(Long planId, String dayOfWeek);
}
