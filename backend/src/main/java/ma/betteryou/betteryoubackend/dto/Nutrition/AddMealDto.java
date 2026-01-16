package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddMealDto {
    private Long idMeal;
    private String dayOfWeek;
    private String mealSlot;
}
