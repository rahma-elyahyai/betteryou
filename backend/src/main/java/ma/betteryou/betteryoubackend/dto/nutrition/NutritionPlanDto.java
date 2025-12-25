package ma.betteryou.betteryoubackend.dto.nutrition;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionPlanDto {
    private Long idNutrition;
    private String nutritionName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String objective;
    private String description;
    private Integer caloriesPerDay;
}
