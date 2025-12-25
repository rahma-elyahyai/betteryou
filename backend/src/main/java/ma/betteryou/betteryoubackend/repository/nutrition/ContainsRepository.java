package ma.betteryou.betteryoubackend.repository.nutrition;
import ma.betteryou.betteryoubackend.entity.nutrition.Contains;
import ma.betteryou.betteryoubackend.entity.nutrition.ContainsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContainsRepository extends JpaRepository<Contains, ContainsId> {

List<Contains> findByMeal_IdMeal(Long idMeal);
}
