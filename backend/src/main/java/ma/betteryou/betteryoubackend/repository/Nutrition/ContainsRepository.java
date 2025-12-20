package ma.betteryou.betteryoubackend.repository.Nutrition;
import ma.betteryou.betteryoubackend.entity.nutrition.Contains;
import ma.betteryou.betteryoubackend.entity.nutrition.ContainsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContainsRepository extends JpaRepository<Contains, ContainsId> {

}
