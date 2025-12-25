package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ComposedOfId implements Serializable {

    private Long idNutrition;
    private Long idMeal;
    private String dayOfWeek;
}
