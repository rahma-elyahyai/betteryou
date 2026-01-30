package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
}
