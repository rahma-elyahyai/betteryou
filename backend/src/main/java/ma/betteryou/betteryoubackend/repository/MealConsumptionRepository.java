package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.nutrition.MealConsumption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MealConsumptionRepository
        extends JpaRepository<MealConsumption, Long> {

    // 🔹 Consommations d’un user entre deux dates
    List<MealConsumption> findByUser_IdUserAndConsumptionDateBetween(
        Integer userId, LocalDate start, LocalDate end
);
}
