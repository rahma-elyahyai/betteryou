// dto/session/PerformanceDto.java
package ma.betteryou.betteryoubackend.dto.session;

public class PerformanceDto {
    private String date;
    private Double weight;
    private Integer reps;
    private Integer sets;

    public PerformanceDto() {}

    public PerformanceDto(String date, Double weight, Integer reps, Integer sets) {
        this.date = date;
        this.weight = weight;
        this.reps = reps;
        this.sets = sets;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }

}
