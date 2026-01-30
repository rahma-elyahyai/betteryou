package ma.betteryou.betteryoubackend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "session_exercise")
public class SessionExerciseR {

    @EmbeddedId
    private SessionExerciseIdR id;

    // relation vers WorkoutSession (id_session)
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sessionId")                     // lie le champ id.sessionId
    @JoinColumn(name = "id_session")
    private WorkoutSessionR session;

    // relation vers Exercise (id_exercise)
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("exerciseId")                    // lie le champ id.exerciseId
    @JoinColumn(name = "id_exercise")
    private ExerciseR exercise;


    @Column(name = "reps")
    private Integer reps;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name="calories_burned")
    private BigDecimal caloriesBurned; // ✅ BigDecimal si DB BigDecimal

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "note")
    private String note;


    public SessionExerciseR() {}

    public SessionExerciseR(WorkoutSessionR session,
                           ExerciseR exercise,
                           Integer orderInSession,
                           Integer reps,
                           Integer restSeconds,
                           Integer sets) {
        this.session = session;
        this.exercise = exercise;
        this.reps = reps;
        this.restSeconds = restSeconds;
        this.sets = sets;
        this.id = new SessionExerciseIdR(
            session != null ? session.getId() : null,
            orderInSession,
            exercise != null ? exercise.getId() : null
        );

    }

    public SessionExerciseIdR getId() {
        return id;
    }

    public void setId(SessionExerciseIdR id) {
        this.id = id;
    }

    public WorkoutSessionR getSession() {
        return session;
    }

    public void setSession(WorkoutSessionR session) {
        this.session = session;
    }

    public ExerciseR getExercise() {
        return exercise;
    }

    public void setExercise(ExerciseR exercise) {
        this.exercise = exercise;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getRestSeconds() {
        return restSeconds;
    }

    public void setRestSeconds(Integer restSeconds) {
        this.restSeconds = restSeconds;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public BigDecimal getCaloriesBurned() {
        return caloriesBurned;
    }
    public void setCaloriesBurned(BigDecimal caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public String getNote() {
        return note;
    }
    public void setNote(String note) {
        this.note = note;
    }
}



