package ma.betteryou.betteryoubackend.dto.session;

import java.util.List;


public class SessionDetailDto {

    private Long id;
    private String sessionDate;
    private Integer durationMinutes;
    private String sessionStatus;
    private String sessionType;
    private String programName;

    private List<SessionExerciseDetailDto> exercises;

    // getters / setters
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
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

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public List<SessionExerciseDetailDto> getExercises() {
        return exercises;
    }

    public void setExercises(List<SessionExerciseDetailDto> exercises) {
        this.exercises = exercises;
    }
}