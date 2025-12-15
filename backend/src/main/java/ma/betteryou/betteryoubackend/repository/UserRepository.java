package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> { // 🔴 Long ici

    Optional<User> findByEmail(String email);
}
