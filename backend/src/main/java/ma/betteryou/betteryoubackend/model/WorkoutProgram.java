package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "workout_program")
@Getter
@Setter
@NoArgsConstructor
public class WorkoutProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_program")
    private Long id;

    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(name = "description")
    private String description;

    // LOSE_WEIGHT / MAINTAIN / GAIN_MASS (check en DB)
    @Column(name = "goal")
    private String goal;

    // AUTO_AI / MANUAL
    @Column(name = "generation_type")
    private String generationType;

    // ONGOING / COMPLETED / CANCELLED
    @Column(name = "program_status")
    private String programStatus;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expected_end_date")
    private LocalDate expectedEndDate;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user; // ton entité déjà existante

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutSession> sessions;
}
