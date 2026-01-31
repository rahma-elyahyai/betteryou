package ma.betteryou.betteryoubackend.repository.Nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.MealConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MealConsumptionRepository extends JpaRepository<MealConsumption, Long> {

    Optional<MealConsumption> findByUser_IdUserAndMeal_IdMealAndConsumptionDate(
            Long userId,
            Long mealId,
            LocalDate consumptionDate
    );

    // 🔹 Consommations d'un user entre deux dates (ANCIENNE - garde-la)
    List<MealConsumption> findByUser_IdUserAndConsumptionDateBetween(
        long userId, LocalDate start, LocalDate end
    );

    // 🔹 NOUVELLE MÉTHODE avec JOIN FETCH pour éviter Lazy Loading
    @Query("SELECT DISTINCT mc FROM MealConsumption mc " +
           "LEFT JOIN FETCH mc.meal m " +
           "LEFT JOIN FETCH m.contains c " +
           "LEFT JOIN FETCH c.foodItem " +
           "WHERE mc.user.idUser = :userId " +
           "AND mc.consumptionDate BETWEEN :start AND :end")
    List<MealConsumption> findByUserWithDetailsAndConsumptionDateBetween(
        @Param("userId") long userId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}