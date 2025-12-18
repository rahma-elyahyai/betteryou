package ma.betteryou.betteryoubackend.repository.Nutrition;
import ma.betteryou.betteryoubackend.entity.nutrition.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<FoodItem,Long> {

}
