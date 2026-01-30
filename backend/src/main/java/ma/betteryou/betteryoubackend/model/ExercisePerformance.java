package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_performance")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ExercisePerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "exercise_id", nullable = false)
    private Long exerciseId;

    @Column(name = "perf_date", nullable = false)
    private LocalDate perfDate;

    @Column(name = "weight")
    private BigDecimal weight;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
