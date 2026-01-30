package ma.betteryou.betteryoubackend.dto.session;

import java.util.List;

public class SessionExerciseDetailDto {

    private Long idExercise;
    private String exerciseName;
    private String description;
    private Integer sets;
    private String reps;
    private Integer restSeconds;
    private Integer orderInSession;

    private String targetMuscle;
    private String difficultyLevel;
    private String equipmentNeeded;
    private Integer caloriesBurned;
    private String note;               // note de l'utilisateur
    private String videoUrl; 
              // url vidéo depuis Exercise (optionnel)
    private List<PerformanceDto> performanceHistory; // historique

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public List<PerformanceDto> getPerformanceHistory() { return performanceHistory; }
    public void setPerformanceHistory(List<PerformanceDto> performanceHistory) {
        this.performanceHistory = performanceHistory;
    }

    public Long getIdExercise() {
        return idExercise;
    }

    public void setIdExercise(Long idExercise) {
        this.idExercise = idExercise;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public String getReps() {
        return reps;
    }
    public void setReps(String reps) {
        this.reps = reps;
    }

    public Integer getRestSeconds() {
        return restSeconds;
    }
    public void setRestSeconds(Integer restSeconds) {
        this.restSeconds = restSeconds;
    }
    public Integer getOrderInSession() {
        return orderInSession;
    }
    public void setOrderInSession(Integer orderInSession) {
        this.orderInSession = orderInSession;
    }
    public String getTargetMuscle() {
        return targetMuscle;
    }
    public void setTargetMuscle(String targetMuscle) {
        this.targetMuscle = targetMuscle;
    }
    public String getDifficultyLevel() {
        return difficultyLevel;
    }
    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }
    public String getEquipmentNeeded() {
        return equipmentNeeded;
    }
    public void setEquipmentNeeded(String equipmentNeeded) {
        this.equipmentNeeded = equipmentNeeded;
    }
    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }
    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }
}