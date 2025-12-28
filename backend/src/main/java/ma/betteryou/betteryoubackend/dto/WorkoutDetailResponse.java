package ma.betteryou.betteryoubackend.dto;

import java.util.List;

public class WorkoutDetailResponse {

    private Long id;
    private String title;
    private String imageUrl;
    private String overview;
    private List<String> benefits;
    private List<String> steps;

    public WorkoutDetailResponse(Long id, String title, String imageUrl,
                                 String overview, List<String> benefits, List<String> steps) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.overview = overview;
        this.benefits = benefits;
        this.steps = steps;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getImageUrl() { return imageUrl; }
    public String getOverview() { return overview; }
    public List<String> getBenefits() { return benefits; }
    public List<String> getSteps() { return steps; }
}
