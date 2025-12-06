package ma.betteryou.betteryoubackend.entity.workout;

import jakarta.persistence.*;
import lombok.*;

import ma.betteryou.betteryoubackend.entity.enums.DifficultyLevel;
import ma.betteryou.betteryoubackend.entity.enums.ExerciseCategory;

@Entity
@Table(name = "exercise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exercise")
    private Long idExercise;

    @Column(name = "exercise_name", nullable = false, length = 100)
    private String exerciseName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "target_muscle", length = 100)
    private String targetMuscle;

    @Column(name = "equipments_needed", length = 255)
    private String equipmentsNeeded;

    // ---------------- ENUMS ----------------
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 20)
    private DifficultyLevel difficultyLevel; // EASY / MODERATE / HARD

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_category", length = 30)
    private ExerciseCategory exerciseCategory; // CARDIO / STRENGTH / FLEXIBILITY / BALANCE

    @Column(name = "duration_min")
    private Integer durationMin;
}
