package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.SessionExercise;
import ma.betteryou.betteryoubackend.model.SessionExerciseId;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SessionExerciseRepository extends JpaRepository<SessionExercise, SessionExerciseId> {

    @Query("""
        select se
        from SessionExercise se
        where se.session.id = :sessionId
        order by se.id.orderInSession asc
    """)
    List<SessionExercise> findBySessionIdOrdered(@Param("sessionId") Long sessionId);

    @Query("""
        select se
        from SessionExercise se
        where se.session.id = :sessionId and se.exercise.id = :exerciseId
    """)
    Optional<SessionExercise> findOne(@Param("sessionId") Long sessionId,
                                      @Param("exerciseId") Long exerciseId);

    @Modifying
    @Transactional
    @Query("""
    DELETE FROM SessionExercise se
    WHERE se.session.program.id IN (
        SELECT p.id
        FROM WorkoutProgram p
        WHERE (p.programStatus = 'ONGOING' AND p.expectedEndDate < :today)
        OR  p.programStatus = 'COMPLETED'
    )
    """)
    int deleteExercisesOfFinishedPrograms(@Param("today") LocalDate today);

}
