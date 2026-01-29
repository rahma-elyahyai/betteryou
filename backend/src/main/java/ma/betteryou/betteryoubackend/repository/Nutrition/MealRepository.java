package ma.betteryou.betteryoubackend.repository.Nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long>, MealRepositoryCustom {
       List<Meal> findMealByGoal(Goal goal);

       List<Meal> findByMealTypeAndGoal(String mealType, Goal goal);

       List<Meal> findByMealType(String mealType);

       List<Meal> findByGoal(Goal goal);

       // 🆕 Méthode optimisée - Version SAFE sans filtre status
       @Query("SELECT DISTINCT m FROM Meal m " +
                     "LEFT JOIN FETCH m.contains c " +
                     "LEFT JOIN FETCH c.foodItem")
       List<Meal> findAllWithIngredientsEager();

       // 🆕 Avec filtres
       @Query("SELECT DISTINCT m FROM Meal m " +
                     "LEFT JOIN FETCH m.contains c " +
                     "LEFT JOIN FETCH c.foodItem " +
                     "WHERE m.mealType = :mealType AND m.goal = :goal")
       List<Meal> findByMealTypeAndGoalWithIngredients(@Param("mealType") String mealType,
                     @Param("goal") Goal goal);

       @Query("SELECT DISTINCT m FROM Meal m " +
                     "LEFT JOIN FETCH m.contains c " +
                     "LEFT JOIN FETCH c.foodItem " +
                     "WHERE m.mealType = :mealType")
       List<Meal> findByMealTypeWithIngredients(@Param("mealType") String mealType);

       @Query("SELECT DISTINCT m FROM Meal m " +
                     "LEFT JOIN FETCH m.contains c " +
                     "LEFT JOIN FETCH c.foodItem " +
                     "WHERE m.goal = :goal")
       List<Meal> findByGoalWithIngredients(@Param("goal") Goal goal);

       @Query("SELECT DISTINCT m FROM Meal m " +
                     "LEFT JOIN FETCH m.contains c " +
                     "LEFT JOIN FETCH c.foodItem " +
                     "WHERE m.idMeal IN :mealIds")
       List<Meal> findByIdInWithIngredients(@Param("mealIds") List<Long> mealIds);
}
