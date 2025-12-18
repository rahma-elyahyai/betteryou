package ma.betteryou.betteryoubackend.service.NutritionService;
import java.math.BigDecimal;
import java.util.List;

import ma.betteryou.betteryoubackend.dto.Nutrition.MealDetailDto;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;

public interface MealService {
    public List<Meal> findMealByGoal(Goal goal);
    public MealDetailDto getMealById(Long id);
    public List<MealDetailDto> getRecommendationsByUser(Long userId, int limit);
    public BigDecimal computeCalories(Meal meal);
    public BigDecimal computeProteins(Meal meal);
    public BigDecimal computeCarbs(Meal meal);
    public BigDecimal computeFats(Meal meal);
    public List<MealDetailDto> getAllMeals();
    public List<MealDetailDto> getAllMeals(String mealType, Goal goal);

        
    
}
