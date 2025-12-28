package ma.betteryou.betteryoubackend.dto.program;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateSessionRequest {
    private String sessionType;
    private Integer durationMinutes;
    private String sessionStatus;
    private LocalDate sessionDate;

    private String dayLabel;
    private List<String> targetMuscles;
    private List<CreateSessionExerciseRequest> exercises;
}
