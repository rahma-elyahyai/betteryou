package ma.betteryou.betteryoubackend.dto.Nutrition;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiMealItemDto {
    private String foodName;
    private BigDecimal quantityGrams;
}
