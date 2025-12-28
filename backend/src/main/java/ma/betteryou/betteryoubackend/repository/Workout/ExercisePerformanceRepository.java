package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.ExercisePerformance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExercisePerformanceRepository extends JpaRepository<ExercisePerformance, Long> {
    List<ExercisePerformance> findBySessionIdAndExerciseIdOrderByPerfDateDesc(Long sessionId, Long exerciseId);
}
