package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "exercise")
@Getter
@Setter
@NoArgsConstructor
public class ExerciseR {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exercise")
    private Long id;

    @Column(name = "exercise_name", nullable = false, length = 100)
    private String exerciseName;

    @Column(name = "description")
    private String description;

    // CARDIO / STRENGTH / FLEXIBILITY / BALANCE
    @Column(name = "exercise_category")
    private String exerciseCategory;

    @Column(name = "difficulty_level")
    private String difficultyLevel;   // EASY / MODERATE / HARD

    @Column(name = "target_muscle")
    private String targetMuscle;

    @Column(name = "equipments_needed")
    private String equipmentsNeeded;

    @Column(name = "duration_min")
    private Integer durationMin;

    @Column(name = "calories_burned", precision = 6, scale = 2)
    private BigDecimal caloriesBurned;

    @Column(name="video_url")
    private String videoUrl;

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }


}
