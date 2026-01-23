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

//JPA ne peut pas gérer ça avec un simple @Id, il a besoin d’une classe spéciale pour les regrouper.

// Cette classe (SessionExerciseId) existe uniquement pour représenter la clé primaire de ton entité principale SessionExercise.
// Embeddable  : Cette classe n’est pas une entité, mais elle peut être utilisée dans une autre entité comme clé