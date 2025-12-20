package ma.betteryou.betteryoubackend.controller.Nutrition;
import lombok.AllArgsConstructor;
import ma.betteryou.betteryoubackend.service.NutritionService.MealConsumptionService;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Nutrition.AddMealDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.MealConsumptionDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.NutritionPlanDto;
import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOf;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.service.NutritionService.NutritionPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/myprograms")
@RequiredArgsConstructor
public class MyPrograms {

    private final NutritionPlanService nutritionPlanService;
    private final MealConsumptionService mealConsumptionService;

    @GetMapping("/user/{idUser}")
    public ResponseEntity<List<NutritionPlanDto>> getNutritionPlanByUserId(@PathVariable Long idUser, @RequestParam String dayOfWeek) {
        try {
            List<NutritionPlanDto> nutritionPlans = nutritionPlanService.getNutritionPlanByUserId(idUser,dayOfWeek);
            return ResponseEntity.ok(nutritionPlans);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error fetching nutrition plan for user with id: " + idUser, e);
        }
    }
    @PostMapping("/recordMealConsumption")
    public ResponseEntity<MealConsumptionDto> recordMealConsumption(@RequestBody MealConsumptionDto req) {
        MealConsumptionDto dto = mealConsumptionService.recordMealConsumption(
            req.getUserId().longValue(),
            req.getMealId(),
            req.getConsumptionDate(),
            req.getServings()
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/saveNutritionPlan")
    public ResponseEntity<NutritionPlanDto> saveNutritionPlan(@RequestBody NutritionPlanDto nutritionPlanDto) {
        NutritionPlanDto savedPlan = nutritionPlanService.saveNutritionPlanDto(nutritionPlanDto);
        return ResponseEntity.ok(savedPlan);
    }

    @PostMapping("nutritionplans/{idNutrition}/addMeal/{idMeal}")
    public ResponseEntity<NutritionPlanDto> addMealToNutritionPlan(@PathVariable Long idNutrition ,@PathVariable Long idMeal , @RequestBody AddMealDto req){
        NutritionPlanDto nutritionplan = nutritionPlanService.addMealToNutritionPlan(
            idNutrition,
            idMeal,
            req.getDayOfWeek(),
            req.getMealSlot()
        );
        return ResponseEntity.ok(nutritionplan);
    }

        // Dans NutritionPlanController.java
    @DeleteMapping("/nutritionplans/{idNutrition}/removeMeal")
    public ResponseEntity<Void> removeMealFromPlan(
        @PathVariable Long idNutrition,
        @RequestParam Long idMeal,
        @RequestParam String dayOfWeek,
        @RequestParam String mealSlot
    ) {
        nutritionPlanService.removeMealFromPlan(idNutrition,idMeal,  dayOfWeek, mealSlot);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/nutritionplans/{idNutrition}/update")
    public ResponseEntity<Void> updateNutritionPlan(
        @PathVariable Long idNutrition,
        @RequestBody NutritionPlanDto nutritionPlanDto
    ) {
        nutritionPlanService.updateNutritionPlan(idNutrition, nutritionPlanDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/nutritionplans/{idNutrition}/delete")
    public ResponseEntity<Void> deletePlan(
        @PathVariable Long idNutrition
    ){
        nutritionPlanService.deletePlan(idNutrition);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/nutritionplans/{idNutrition}/replaceMeal")
    public ResponseEntity<NutritionPlanDto> replaceMealInPlan(
    @PathVariable Long idNutrition,
    @RequestParam Long oldMealId,  // ✅ AJOUTER CE PARAMÈTRE
    @RequestParam Long newMealId,  // ✅ RENOMMER
    @RequestParam String dayOfWeek,
    @RequestParam String mealSlot
) {
    NutritionPlanDto updatedPlan = nutritionPlanService.replaceMealInPlan(
        idNutrition,
        oldMealId,   // ✅ Ancien meal
        newMealId,   // ✅ Nouveau meal
        dayOfWeek,
        mealSlot
    );
    return ResponseEntity.ok(updatedPlan);
}
}
