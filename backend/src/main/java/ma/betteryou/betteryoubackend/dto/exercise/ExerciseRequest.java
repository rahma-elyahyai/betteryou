package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {
    private Long idExercise;
    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private Integer orderInSession;
}
