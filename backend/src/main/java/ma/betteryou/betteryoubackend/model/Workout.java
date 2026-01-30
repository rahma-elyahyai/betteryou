package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;          // Bench Press, Squats...
    private String targetMuscles;  // Pectorals, Triceps...
    private String duration;       // "20-25 min"
    private String level;          // Beginner, Intermediate, Advanced
    private String imageUrl;       // URL de l’image

    // Texte long : description générale de l’exercice
    @Column(columnDefinition = "TEXT")
    private String overview;

    // Liste des bénéfices, séparés par "||"
    @Column(columnDefinition = "TEXT")
    private String benefits;

    // Liste des étapes séparées par "||"
    @Column(columnDefinition = "TEXT")
    private String steps;

    // ---- Constructeurs ----
    public Workout() {}

    public Workout(String title, String targetMuscles, String duration, String level, String imageUrl) {
        this.title = title;
        this.targetMuscles = targetMuscles;
        this.duration = duration;
        this.level = level;
        this.imageUrl = imageUrl;
    }

    // ---- Getters / Setters ----
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTargetMuscles() { return targetMuscles; }
    public void setTargetMuscles(String targetMuscles) { this.targetMuscles = targetMuscles; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }

    public String getSteps() { return steps; }
    public void setSteps(String steps) { this.steps = steps; }
}
