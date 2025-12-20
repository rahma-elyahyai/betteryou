package ma.betteryou.betteryoubackend.repository.Nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.MealConsumption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface MealConsumptionRepository extends JpaRepository<MealConsumption, Long> {

    Optional<MealConsumption> findByUser_IdUserAndMeal_IdMealAndConsumptionDate(
            Long userId,
            Long mealId,
            LocalDate consumptionDate
    );
}
