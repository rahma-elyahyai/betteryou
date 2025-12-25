package ma.betteryou.betteryoubackend.controller.nutrition;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.nutrition.*;
import ma.betteryou.betteryoubackend.dto.nutrition.ai.*;
import ma.betteryou.betteryoubackend.service.nutrition.AiNutritionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@CrossOrigin(
  origins = {"http://localhost:5173","http://localhost:3000"},
  allowedHeaders = "*",
  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
  allowCredentials = "true"
)
public class AiNutritionController {

    private final AiNutritionService aiNutritionService;

    // ✅ Generate (MOCK now)
    @PostMapping("/ai/generate")
    public AiNutritionGenerateResponse generate(@RequestBody AiNutritionGenerateRequest req) {
        return aiNutritionService.generate(req);
    }

    // ✅ List plans by user
    @GetMapping("/plans/user/{userId}")
    public List<NutritionPlanDto> getPlansByUser(@PathVariable Long userId) {
        return aiNutritionService.getPlansByUser(userId);
    }

    // ✅ Plan details
    @GetMapping("/plans/{planId}")
    public NutritionPlanDto getPlan(@PathVariable Long planId) {
        return aiNutritionService.getPlan(planId);
    }

    // ✅ Meals by day
    @GetMapping("/plans/{planId}/meals")
    public List<MealDto> getMealsByDay(
        @PathVariable Long planId,
        @RequestParam String dayOfWeek
    ) {
        return aiNutritionService.getMealsByDay(planId, dayOfWeek);
    }
}
