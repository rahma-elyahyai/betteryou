package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionPlanDto {
    private Long idNutrition;
    private String nutritionName;
    private String startDate;
    private String endDate;
    private String objective;
    private String description;
    private Integer caloriesPerDay;
    private List<MealDetailDto> meals;
    private Long idUser;
}
