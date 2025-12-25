package ma.betteryou.betteryoubackend.dto.nutrition.ai;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiNutritionGenerateResponse {

    private Long nutritionPlanId;
    private String nutritionName;
    private String objective;
    private Integer caloriesPerDay;

    private LocalDate startDate;
    private LocalDate endDate;

    private boolean generated;

    private String generationSource; // OLLAMA
    private String aiModel;          // llama3.2:latest
}
