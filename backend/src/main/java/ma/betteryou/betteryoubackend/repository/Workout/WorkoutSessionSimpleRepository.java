package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.WorkoutSessionR;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutSessionSimpleRepository extends JpaRepository<WorkoutSessionR, Long> {
}
