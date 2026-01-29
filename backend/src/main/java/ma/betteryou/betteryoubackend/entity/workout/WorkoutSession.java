package ma.betteryou.betteryoubackend.entity.workout;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import ma.betteryou.betteryoubackend.entity.enums.SessionType;
import ma.betteryou.betteryoubackend.entity.enums.SessionStatus;



@Entity
@Table(name = "workout_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_session")
    private Long idSession;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    // ---------------- ENUMS ----------------
    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", length = 20)
    private SessionType sessionType; // CARDIO / STRENGTH / MIXED

    @Enumerated(EnumType.STRING)
    @Column(name = "session_status", length = 20)
    private SessionStatus sessionStatus; // PLANNED / DONE / MISSED

    // Relation avec WORKOUT_PROGRAM
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_program", nullable = false)
    private WorkoutProgram workoutProgram;
}
