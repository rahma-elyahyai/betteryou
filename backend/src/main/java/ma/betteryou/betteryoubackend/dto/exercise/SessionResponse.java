package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private String sessionType;
    private Integer durationMinutes;
    private String dayLabel;
    private List<String> targetMuscles;
    private List<ExerciseResponse> exercises;
}
