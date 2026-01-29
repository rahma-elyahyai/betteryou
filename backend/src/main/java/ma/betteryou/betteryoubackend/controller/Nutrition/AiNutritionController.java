package ma.betteryou.betteryoubackend.controller.Nutrition;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Nutrition.AiDayPlanDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateRequest;
import ma.betteryou.betteryoubackend.dto.Nutrition.AiNutritionGenerateResponse;
import ma.betteryou.betteryoubackend.service.ai.nutrition.AiNutritionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/nutrition/ai")
public class AiNutritionController {

    private final AiNutritionService aiNutritionService;

    // ✅ 1) Test OpenAI
    @GetMapping("/test")
    public String testAi() {
        return aiNutritionService.testJson();
    }

    // ✅ 2) Generate full week (7 days) + save DB + return all days
    @PostMapping("/generate")
    public AiNutritionGenerateResponse generate(@RequestBody AiNutritionGenerateRequest req) {
        return aiNutritionService.generate(req);
    }

    // ✅ 3) Get full week from DB
    @GetMapping("/plans/{planId}/week")
    public List<AiDayPlanDto> getWeek(@PathVariable Long planId) {
        return aiNutritionService.getWeek(planId);
    }

    // ✅ 4) Get one day from DB
    @GetMapping("/plans/{planId}/day/{dayOfWeek}")
    public AiDayPlanDto getDay(@PathVariable Long planId, @PathVariable String dayOfWeek) {
        return aiNutritionService.getDay(planId, dayOfWeek);
    }
}
