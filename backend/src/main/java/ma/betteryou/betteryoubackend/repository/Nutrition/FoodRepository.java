package ma.betteryou.betteryoubackend.repository.Nutrition;

import ma.betteryou.betteryoubackend.entity.nutrition.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodRepository extends JpaRepository<FoodItem, Long> {

    // ✅ باش نلقاو نفس الطعام إذا كان موجود (تفادي duplicates)
    Optional<FoodItem> findFirstByFoodNameIgnoreCase(String foodName);
}
