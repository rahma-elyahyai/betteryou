
package ma.betteryou.betteryoubackend.entity.workout;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "session_exercise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionExercise {

    @EmbeddedId
    private SessionExerciseId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idSession")
    @JoinColumn(name = "id_session", nullable = false)
    private WorkoutSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idExercise")
    @JoinColumn(name = "id_exercise", nullable = false)
    private Exercise exercise;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "order_in_session")
    private Integer orderInSession;
}
