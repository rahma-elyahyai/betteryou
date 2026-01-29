
package ma.betteryou.betteryoubackend.entity.workout;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import ma.betteryou.betteryoubackend.entity.enums.ProgramGenerationType;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.ProgramStatus;

import ma.betteryou.betteryoubackend.entity.user.User;

@Entity
@Table(name = "workout_program")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_program")
    private Long idProgram;

    @Column(name = "program_name", nullable = false, length = 100)
    private String programName;

    @Column(name = "description", length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "generation_type", length = 20)
    private ProgramGenerationType generationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal", length = 20)
    private Goal goal;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expected_end_date")
    private LocalDate expectedEndDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "program_status", length = 20)
    private ProgramStatus programStatus;

    // Relation MANY TO ONE vers USER (id_user)
    @ManyToOne(fetch = FetchType.LAZY)  // Ne charge pas automatiquement l’objet User quand tu charges le programme.uniquement si on l’appelle (workoutProgram.getUser())
    @JoinColumn(name = "id_user", nullable = false) // configure la colonne de clé étrangère dans la table workout_program.
    private User user;
}
