package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExercisePickDto {
    private String programName;
    private String description;
    private String goal;           // LOSE_WEIGHT, MAINTAIN, GAIN_MASS
    private String generationType; // MANUAL, AUTO_AI
    private List<SessionRequest> sessions;
}
