package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.SessionExerciseR;
import ma.betteryou.betteryoubackend.model.SessionExerciseIdR;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SessionExerciseRepositoryR extends JpaRepository<SessionExerciseR, SessionExerciseIdR> {

    @Query("""
        select se
        from SessionExerciseR se
        where se.session.id = :sessionId
        order by se.id.orderInSession asc
    """)
    List<SessionExerciseR> findBySessionIdOrdered(@Param("sessionId") Long sessionId);

    @Query("""
        select se
        from SessionExerciseR se
        where se.session.id = :sessionId and se.exercise.id = :exerciseId
    """)
    Optional<SessionExerciseR> findOne(@Param("sessionId") Long sessionId,
                                      @Param("exerciseId") Long exerciseId);

    @Modifying
    @Transactional
    @Query("""
    DELETE FROM SessionExerciseR se
    WHERE se.session.program.id IN (
        SELECT p.id
        FROM WorkoutProgramR p
        WHERE (p.programStatus = 'ONGOING' AND p.expectedEndDate < :today)
        OR  p.programStatus = 'COMPLETED'
    )
    """)
    int deleteExercisesOfFinishedPrograms(@Param("today") LocalDate today);

}