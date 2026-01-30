package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.ExerciseR;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<ExerciseR, Long> {

    @Query("SELECT DISTINCT e.targetMuscle FROM ExerciseR e WHERE e.targetMuscle IS NOT NULL")
    List<String> findAllTargetMuscles();

    @Query("""
        SELECT e FROM ExerciseR e
        WHERE (:category IS NULL OR :category = '' OR UPPER(e.exerciseCategory) = UPPER(:category))
          AND (:equipment IS NULL OR :equipment = '' OR LOWER(e.equipmentsNeeded) LIKE LOWER(CONCAT('%', :equipment, '%')))
          AND (:muscle IS NULL OR :muscle = '' OR LOWER(e.targetMuscle) LIKE LOWER(CONCAT('%', :muscle, '%')))
        ORDER BY e.exerciseName
    """)
    List<ExerciseR> searchExercises(
            @Param("category") String category,
            @Param("equipment") String equipment,
            @Param("muscle") String muscle
    );

    @Query("select e.id from ExerciseR e")
    java.util.List<Long> findAllIds();
}
