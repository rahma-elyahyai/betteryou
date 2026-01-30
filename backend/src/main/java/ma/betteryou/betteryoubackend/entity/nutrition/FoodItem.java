package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "food_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_food")
    private Long idFood;

    @Column(name = "food_name", nullable = false, length = 100)
    private String foodName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "calories_per_100g", precision = 6, scale = 2)
    private BigDecimal caloriesPer100g;

    @Column(name = "proteins_per_100g", precision = 6, scale = 2)
    private BigDecimal proteinsPer100g;

    @Column(name = "carbs_per_100g", precision = 6, scale = 2)
    private BigDecimal carbsPer100g;

    @Column(name = "fats_per_100g", precision = 6, scale = 2)
    private BigDecimal fatsPer100g;

}
