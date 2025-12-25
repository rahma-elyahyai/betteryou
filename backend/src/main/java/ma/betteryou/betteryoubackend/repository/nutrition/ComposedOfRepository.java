package ma.betteryou.betteryoubackend.repository.nutrition;
import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOf;
import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOfId;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ComposedOfRepository extends JpaRepository<ComposedOf, ComposedOfId> {

    @Query("SELECT c FROM ComposedOf c WHERE " +
           "c.nutritionPlan.idNutrition = :planId AND " +
           "c.meal.idMeal = :mealId AND " +
           "c.id.dayOfWeek = :dayOfWeek AND " +
           "c.mealSlot = :mealSlot")
    Optional<ComposedOf> findByNutritionPlanIdAndMealIdAndDayOfWeekAndMealSlot(
        @Param("planId") Long planId,
        @Param("mealId") Long mealId,
        @Param("dayOfWeek") String dayOfWeek,
        @Param("mealSlot") String mealSlot
    );
List<ComposedOf> findByNutritionPlan_IdNutrition(Long planId);

    List<ComposedOf> findByNutritionPlan_IdNutritionAndId_DayOfWeek(Long planId, String dayOfWeek);
}
