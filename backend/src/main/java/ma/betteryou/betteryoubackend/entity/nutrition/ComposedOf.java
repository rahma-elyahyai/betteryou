package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "composed_of")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComposedOf {

    @EmbeddedId
    private ComposedOfId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idNutrition")
    @JoinColumn(name = "id_nutrition", nullable = false)
    private NutritionPlan nutritionPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idMeal")
    @JoinColumn(name = "id_meal", nullable = false)
    private Meal meal;

<<<<<<< HEAD
    @Column(name="meal_slot")
    private String mealSlot; // ou enum

}
=======
}
>>>>>>> soukaina
