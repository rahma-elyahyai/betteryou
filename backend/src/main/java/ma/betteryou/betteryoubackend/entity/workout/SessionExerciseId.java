package ma.betteryou.betteryoubackend.entity.workout;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SessionExerciseId implements Serializable {

    private Long idSession;
    private Long idExercise;
}
