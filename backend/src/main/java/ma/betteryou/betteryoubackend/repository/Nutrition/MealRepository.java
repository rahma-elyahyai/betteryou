package ma.betteryou.betteryoubackend.repository.Nutrition;

import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long>, MealRepositoryCustom {

    // ✅ Methods utilisés par ton équipe (MealImp)
    List<Meal> findMealByGoal(Goal goal);

    List<Meal> findByGoal(Goal goal);

    List<Meal> findByMealType(String mealType);

    List<Meal> findByMealTypeAndGoal(String mealType, Goal goal);
}
