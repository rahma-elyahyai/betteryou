package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_session")
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_session")
    private Long id;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "session_status")
    private String sessionStatus;   // PLANNED / DONE / MISSED

    @Column(name = "session_type")
    private String sessionType;     // CARDIO / STRENGTH / MIXED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_program")
    private WorkoutProgram program;

    // ⚠️ ICI : collection de SessionExercise (l'entité), PAS SessionExerciseId
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionExercise> sessionExercises = new ArrayList<>();

    public WorkoutSession() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getSessionStatus() {
        return sessionStatus;
    }

    public void setSessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public WorkoutProgram getProgram() {
        return program;
    }

    public void setProgram(WorkoutProgram program) {
        this.program = program;
    }

    public List<SessionExercise> getSessionExercises() {
        return sessionExercises;
    }

    public void setSessionExercises(List<SessionExercise> sessionExercises) {
        this.sessionExercises = sessionExercises;
    }

    // petit helper pratique
    public void addSessionExercise(SessionExercise se) {
        sessionExercises.add(se);
        se.setSession(this);
    }

    public void removeSessionExercise(SessionExercise se) {
        sessionExercises.remove(se);
        se.setSession(null);
    }
}
