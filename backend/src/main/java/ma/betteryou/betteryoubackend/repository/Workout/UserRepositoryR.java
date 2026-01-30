package ma.betteryou.betteryoubackend.repository.Workout;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.betteryou.betteryoubackend.entity.user.User;

public interface UserRepositoryR extends JpaRepository<User, Long> {
}
