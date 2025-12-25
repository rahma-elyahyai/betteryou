package ma.betteryou.betteryoubackend.repository.nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOf;
import ma.betteryou.betteryoubackend.entity.nutrition.NutritionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionPlanRepository extends JpaRepository<NutritionPlan, Long> {
    
    // ✅ Retourne une Liste, pas un Optional
    List<NutritionPlan> findByUser_IdUser(Long idUser);
      
}