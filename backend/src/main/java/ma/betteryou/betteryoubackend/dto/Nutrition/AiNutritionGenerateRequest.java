package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiNutritionGenerateRequest {
    private Long userId;
    private String objective;      // "GAIN_MASS" | "LOSE_WEIGHT" | "MAINTAIN" | "PERFORMANCE"
    private LocalDate startDate;   // 2025-01-01
    private LocalDate endDate;     // 2025-01-07 (on va FORCER 7 jours)
    private Integer caloriesPerDay;
}
