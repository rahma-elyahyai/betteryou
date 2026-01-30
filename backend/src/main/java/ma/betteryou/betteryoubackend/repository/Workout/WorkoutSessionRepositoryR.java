package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.WorkoutSessionR;
import ma.betteryou.betteryoubackend.model.WorkoutProgramR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutSessionRepositoryR extends JpaRepository<WorkoutSessionR, Long> {
    List<WorkoutSessionR> findTop3ByProgramOrderBySessionDateDesc(WorkoutProgramR program);
@Modifying
@Transactional
@Query("""
DELETE FROM WorkoutSessionR s
WHERE s.program.id IN (
    SELECT p.id
    FROM WorkoutProgramR p
    WHERE (p.programStatus = 'ONGOING' AND p.expectedEndDate < :today)
       OR  p.programStatus = 'COMPLETED'
)
""")
int deleteSessionsOfFinishedPrograms(@Param("today") LocalDate today);

}
