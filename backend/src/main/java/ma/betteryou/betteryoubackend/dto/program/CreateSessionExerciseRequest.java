package ma.betteryou.betteryoubackend.dto.program;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateSessionExerciseRequest {
    private Long idExercise;
    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private Integer orderInSession;
}
