package ma.betteryou.betteryoubackend.controller.Nutrition;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Nutrition.MealDetailDto;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.service.NutritionService.MealService;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"}) //sans cela, erreur CORS lors des appels depuis le front
public class RecommendationController {
    private final MealService mealService;
    @GetMapping("/user/{userId}")  // /api/recommendations/user/{userId}
    // GET http://localhost:8080/api/recommendations/user/2
    // GET http://localhost:8080/api/recommendations/user/2?limit=4
    public List<MealDetailDto> getRecommendationsByUser(
        @PathVariable Long userId,
        @RequestParam(defaultValue = "4") int limit
    ) {
        try {
            System.out.println(">>> getRecommendationsByUser called with userId=" + userId + ", limit=" + limit);
            return mealService.getRecommendationsByUser(userId, limit);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error fetching recommendations for user with id: " + userId, e);
        }
    };

    @GetMapping("/user/{userId}/meal/{mealId}")
    // GET http://localhost:8080/api/recommendations/user/2/meal/5
    public ResponseEntity<?> getMealDetails(
        @PathVariable Long userId,
        @PathVariable Long mealId
    ) {
        try {
            MealDetailDto meal = mealService.getMealById(mealId);
            return ResponseEntity.ok(meal);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Meal not found with id: " + mealId);
        }
    };

            // Dans MealController.java
        @GetMapping("/meals")
        public ResponseEntity<List<MealDetailDto>> getAllMeals() {
            List<MealDetailDto> meals = mealService.getAllMeals();
            return ResponseEntity.ok(meals);
        }

        // Optionnel avec filtres
        @GetMapping("/mealsfiltered")
        public ResponseEntity<List<MealDetailDto>> getAllMeals(
            @RequestParam(required = false) String mealType,
            @RequestParam(required = false) Goal goal
        ) {
            List<MealDetailDto> meals = mealService.getAllMeals(mealType, goal);
            return ResponseEntity.ok(meals);
        }
}


