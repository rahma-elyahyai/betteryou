package ma.betteryou.betteryoubackend.dto.nutrition.ai;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiNutritionGenerateRequest {
    private Long userId;
    private String objective;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer caloriesPerDay;
    private String generationMode; // optionnel
}
