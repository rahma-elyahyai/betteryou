package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.FoodPreferences;

import java.math.BigDecimal;
import java.util.List;


@Data
@Builder        // permet d'avoir des “paramètres optionnels”
@AllArgsConstructor
@NoArgsConstructor
public class MealDetailDto {

    private Long idMeal;
    private String mealName;
    private String description;
    private Goal goal;
    private FoodPreferences foodPreferences;
    private String mealType;
    private String imageUrl;
    private List<IngredientDto> ingredients;
    // valeurs calculées (optionnelles)
    private BigDecimal calories;
    private BigDecimal proteins;
    private BigDecimal carbs;
    private BigDecimal fats;
    private String preparationSteps;
    private String mealSlot;
}
