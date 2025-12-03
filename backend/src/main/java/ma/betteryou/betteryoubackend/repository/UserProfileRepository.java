package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}
