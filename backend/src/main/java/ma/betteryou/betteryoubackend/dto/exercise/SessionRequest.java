package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionRequest {
    private String sessionType;        // CARDIO, STRENGTH, MIXED
    private Integer durationMinutes;
    private String dayLabel;           // Mon, Tue...
    private List<String> targetMuscles;
    private List<ExerciseRequest> exercises;
}
