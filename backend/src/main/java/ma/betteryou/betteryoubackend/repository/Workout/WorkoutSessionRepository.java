package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.WorkoutSession;
import ma.betteryou.betteryoubackend.model.WorkoutProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findTop3ByProgramOrderBySessionDateDesc(WorkoutProgram program);
@Modifying
@Transactional
@Query("""
DELETE FROM WorkoutSession s
WHERE s.program.id IN (
    SELECT p.id
    FROM WorkoutProgram p
    WHERE (p.programStatus = 'ONGOING' AND p.expectedEndDate < :today)
       OR  p.programStatus = 'COMPLETED'
)
""")
int deleteSessionsOfFinishedPrograms(@Param("today") LocalDate today);

}
