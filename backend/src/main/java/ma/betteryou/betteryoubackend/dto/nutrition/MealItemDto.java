package ma.betteryou.betteryoubackend.dto.nutrition;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class MealItemDto {
    private Long idFood;
    private String foodName;
    private BigDecimal quantityGrams;
}
