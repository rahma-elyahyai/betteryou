package ma.betteryou.betteryoubackend.dto.Nutrition;
import lombok.Builder;
import lombok.Data;

// Créer ReplaceMealDto.java
@Data
@Builder
public class ReplaceMealDto {
    private Long oldMealId;
    private Long newMealId;
    private String dayOfWeek;
    private String mealSlot;
}
