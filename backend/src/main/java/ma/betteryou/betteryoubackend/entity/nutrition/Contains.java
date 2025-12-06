package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "contains")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contains {

    @EmbeddedId
    private ContainsId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idMeal")
    @JoinColumn(name = "id_meal", nullable = false)
    private Meal meal;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idFood")
    @JoinColumn(name = "id_food", nullable = false)
    private FoodItem foodItem;

    @Column(name = "quantity_grams", precision = 6, scale = 2)
    private BigDecimal quantityGrams;
}
