package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiMealDto {
    private String mealSlot;              // BREAKFAST | LUNCH | DINNER | SNACK
    private String mealName;
    private String description;
    private List<String> preparationSteps;
    private List<AiMealItemDto> items;
}
