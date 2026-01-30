package ma.betteryou.betteryoubackend.dto.program;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramWizardResponse {
    private Long programId;
    private String message;
    private List<Long> sessionIds;
}
