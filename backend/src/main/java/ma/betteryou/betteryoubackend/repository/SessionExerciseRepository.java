package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.workout.SessionExercise;
import ma.betteryou.betteryoubackend.entity.workout.SessionExerciseId;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionExerciseRepository extends JpaRepository<SessionExercise, SessionExerciseId> {

    long countBySessionIn(List<WorkoutSession> sessions);
}
