package ma.betteryou.betteryoubackend.dto.program;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateProgramRequest {
    private String programName;
    private String description;
    private String goal;
    private String generationType;
    private String programStatus;
    private LocalDate startDate;

    private List<CreateSessionRequest> sessions;
}
