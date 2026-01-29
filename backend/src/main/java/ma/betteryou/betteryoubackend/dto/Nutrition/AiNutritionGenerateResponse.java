package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiNutritionGenerateResponse {
    private Long nutritionPlanId;
    private String nutritionName;
    private String objective;
    private Integer caloriesPerDay;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean generated;
    private String aiModel;

    // ✅ TOUTE LA SEMAINE POUR POSTMAN / FRONT
    private List<AiDayPlanDto> days;
}
