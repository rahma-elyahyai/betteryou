package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.enums.SessionStatus;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {

    // séances de la semaine pour un user donné (via program)
    @Query("""
        SELECT ws
        FROM WorkoutSession ws
        JOIN ws.workoutProgram wp
        WHERE wp.user.idUser = :userId
          AND ws.sessionDate BETWEEN :start AND :end
    """)
    List<WorkoutSession> findSessionsForUserBetween(
            @Param("userId") Integer userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    // séances futures (Upcoming)
    @Query("""
        SELECT ws
        FROM WorkoutSession ws
        JOIN ws.workoutProgram wp
        WHERE wp.user.idUser = :userId
          AND ws.sessionStatus = 'PLANNED'
          AND ws.sessionDate >= :today
        ORDER BY ws.sessionDate ASC
    """)
    List<WorkoutSession> findUpcomingSessions(
            @Param("userId") Integer userId,
            @Param("today") LocalDate today
    );

    // nombre total de séances d’un programme (pour la progression)
    long countByWorkoutProgram_IdProgram(Long idProgram);

    // nombre de séances DONE d’un programme
    long countByWorkoutProgram_IdProgramAndSessionStatus(Long idProgram, SessionStatus status);

    //filtrer par activeProgram.getIdProgram()
        @Query("""
        SELECT ws
        FROM WorkoutSession ws
        WHERE ws.workoutProgram.idProgram = :programId
          AND ws.sessionDate BETWEEN :start AND :end
    """)
    List<WorkoutSession> findByProgramBetween(
            @Param("programId") Long programId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
