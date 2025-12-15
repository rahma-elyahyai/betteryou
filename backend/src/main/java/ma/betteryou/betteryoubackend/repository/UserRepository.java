package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.user.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;


@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
    //pour verifier avant d'accepter registration
    boolean existsByEmail(String email);
    User save(User user);
}
