package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@AllArgsConstructor
@Setter
@Getter
public class MealConsumptionDto {
    private Long idConsumption;
    private Long userId;
    private Long mealId;
    private java.time.LocalDate consumptionDate;
    private Integer servings;
}
