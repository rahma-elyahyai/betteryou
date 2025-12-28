package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.WorkoutSession;
import ma.betteryou.betteryoubackend.model.WorkoutProgram;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findTop3ByProgramOrderBySessionDateDesc(WorkoutProgram program);
}
