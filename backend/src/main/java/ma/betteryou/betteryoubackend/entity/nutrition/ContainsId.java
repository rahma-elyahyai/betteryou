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
public class ContainsId implements Serializable {

    private Long idMeal;
    private Long idFood;
}