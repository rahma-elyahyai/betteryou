package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class SessionExerciseId implements Serializable {

    @Column(name = "id_session")
    private Long sessionId;

     @Column(name = "order_in_session")
    private Integer orderInSession; // ✅ ICI

    @Column(name = "id_exercise")
    private Long exerciseId;
    public SessionExerciseId() {}

    public SessionExerciseId(Long sessionId, Integer orderInSession, Long exerciseId) {
    this.sessionId = sessionId;
    this.orderInSession = orderInSession;
    this.exerciseId = exerciseId;
    }


    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }
    public Integer getOrderInSession() {
        return orderInSession;
    }
    public void setOrderInSession(Integer orderInSession) {
        this.orderInSession = orderInSession;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SessionExerciseId)) return false;
        SessionExerciseId that = (SessionExerciseId) o;
        return Objects.equals(sessionId, that.sessionId)
                && Objects.equals(exerciseId, that.exerciseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sessionId, exerciseId);
    }
}
