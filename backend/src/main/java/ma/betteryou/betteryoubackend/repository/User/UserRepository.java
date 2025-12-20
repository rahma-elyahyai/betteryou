package ma.betteryou.betteryoubackend.repository.User;
import ma.betteryou.betteryoubackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
        // NE RIEN AJOUTER ICI POUR findById — déjà fourni automatiquement par JpaRepository
}
