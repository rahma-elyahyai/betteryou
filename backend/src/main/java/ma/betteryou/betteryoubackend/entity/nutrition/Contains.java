package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonBackReference 
    private Meal meal;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idFood")
    @JoinColumn(name = "id_food", nullable = false)
    private FoodItem foodItem;

    @Column(name = "quantity_grams", precision = 6, scale = 2)
    private BigDecimal quantityGrams;
}
