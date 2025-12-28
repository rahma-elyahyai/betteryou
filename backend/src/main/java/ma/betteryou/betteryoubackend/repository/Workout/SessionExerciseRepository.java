package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.SessionExercise;
import ma.betteryou.betteryoubackend.model.SessionExerciseId;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

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
}
