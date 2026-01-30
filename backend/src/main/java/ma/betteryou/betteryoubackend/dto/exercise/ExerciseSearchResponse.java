package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSearchResponse {
    private Long id;
    private String name;
    private String category;
    private String targetMuscle;
    private String equipment;
    private String difficulty;
}
