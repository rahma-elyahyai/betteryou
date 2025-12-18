package ma.betteryou.betteryoubackend.dto.Nutrition;

import java.math.BigDecimal;

public record IngredientDto(
    String foodName,
    String description,
    BigDecimal quantity_grams,
    BigDecimal calories,
    BigDecimal proteins,
    BigDecimal carbs,
    BigDecimal fats
) {
    
}
