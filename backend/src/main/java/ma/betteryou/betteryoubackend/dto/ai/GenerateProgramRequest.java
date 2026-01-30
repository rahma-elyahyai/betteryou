package ma.betteryou.betteryoubackend.dto.ai;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GenerateProgramRequest {
    private Long userId;
    private String userNotes; // optionnel
}
