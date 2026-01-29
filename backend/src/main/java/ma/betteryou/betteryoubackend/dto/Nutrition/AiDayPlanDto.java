package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiDayPlanDto {
    private String dayOfWeek;      // Monday..Sunday
    private List<AiMealDto> meals;
}
