package ma.betteryou.betteryoubackend.entity.nutrition;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class MealConsumptionId implements Serializable{
    private Integer userId;
    private Integer mealId;
}
