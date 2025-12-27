package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.nutrition.NutritionPlan;
import ma.betteryou.betteryoubackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;
public interface NutritionPlanRepository extends JpaRepository<NutritionPlan, Long> {

    @Query("""
        SELECT np FROM NutritionPlan np
        WHERE np.user.idUser = :userId
          AND np.startDate <= :today
          AND (np.endDate IS NULL OR np.endDate >= :today)
        ORDER BY np.startDate DESC
    """)
    Optional<NutritionPlan> findFirstByUser_IdUserOrderByStartDateDesc(
            @Param("userId") long userId,
            @Param("today") LocalDate today
    );

    // ✅ Retourne une Liste, pas un Optional
    List<NutritionPlan> findByUser_IdUser(Long idUser);

}

