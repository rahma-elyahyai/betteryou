package ma.betteryou.betteryoubackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ma.betteryou.betteryoubackend.entity.nutrition.Contains;
import ma.betteryou.betteryoubackend.entity.nutrition.ContainsId;

//calculer les macros d’un plan
public interface ContainsRepository extends JpaRepository<Contains, ContainsId> {

    @Query("""
                SELECT c
                FROM Contains c
                JOIN c.meal m
                JOIN ComposedOf co ON co.meal = m
                WHERE co.nutritionPlan.idNutrition = :nutritionId
            """)
    List<Contains> findAllByNutritionPlan(@Param("nutritionId") Long nutritionId);

    // ✅ AJOUT: récupérer tous les items d’un meal
    List<Contains> findByMeal_IdMeal(Long idMeal);
}