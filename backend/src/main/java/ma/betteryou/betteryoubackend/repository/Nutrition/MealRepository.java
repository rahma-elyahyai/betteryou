package ma.betteryou.betteryoubackend.repository.Nutrition;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findMealByGoal(Goal goal);
    //parle à BD seulement pas de calculs

    List<Meal> findByMealTypeAndGoal(String mealType, Goal valueOf);

    List<Meal> findByMealType(String mealType);

    List<Meal> findByGoal(Goal valueOf);
}
