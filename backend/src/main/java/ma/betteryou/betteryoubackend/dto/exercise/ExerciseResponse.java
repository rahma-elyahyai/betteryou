package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ExerciseResponse {
    private Long idExercise;
    private String exerciseName;
    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private Integer orderInSession;
}