package ma.betteryou.betteryoubackend.dto.nutrition;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class MealDto {
    private Long idMeal;
    private String mealName;
    private String mealType;
    private String mealSlot;   // from composed_of.meal_slot
    private String dayOfWeek;  // from composed_of.day_of_week
    private String description;
    private List<MealItemDto> items;
}
