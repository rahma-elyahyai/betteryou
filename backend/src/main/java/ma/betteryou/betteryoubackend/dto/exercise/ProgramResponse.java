package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProgramResponse {
    private Long idProgram;
    private String programName;
    private String description;
    private String goal;
    private String programStatus;
    private LocalDate startDate;
    private List<SessionResponse> sessions;
}
