package ma.betteryou.betteryoubackend.repository.nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<FoodItem, Long> {

    // ✅ accepte doublons et choisit le plus ancien
    List<FoodItem> findAllByFoodNameIgnoreCaseOrderByIdFoodAsc(String foodName);
}
