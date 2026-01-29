package ma.betteryou.betteryoubackend.repository.Nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOf;
import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOfId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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

    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("DELETE FROM ComposedOf c WHERE c.nutritionPlan.idNutrition = :idNutrition " +
           "AND c.meal.idMeal = :idMeal " +
           "AND c.id.dayOfWeek = :dayOfWeek " +
           "AND c.mealSlot = :mealSlot")
    void deleteMealFromPlan(
            @Param("idNutrition") Long idNutrition,
            @Param("idMeal") Long idMeal,
            @Param("dayOfWeek") String dayOfWeek,
            @Param("mealSlot") String mealSlot
    );

    // ✅ AJOUT (sans supprimer ton code): tous les liens d’un plan
    List<ComposedOf> findByNutritionPlan_IdNutrition(Long planId);

    // ✅ AJOUT (sans supprimer ton code): liens d’un plan pour un jour
    List<ComposedOf> findByNutritionPlan_IdNutritionAndId_DayOfWeek(Long planId, String dayOfWeek);
}
