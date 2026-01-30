package ma.betteryou.betteryoubackend.dto.session;

public class PerformanceRequest {
    private String date;
    private Double weight;
    private Integer reps;
    private Integer sets;

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }
}
