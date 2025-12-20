package ma.betteryou.betteryoubackend.dto.Profile;

import lombok.*;
import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileInfoDto {

    private String firstName;
    private String lastName;
    private LocalDate birthDate;         // optionnel (on peut le calculer plus tard)
    private String gender;        // FEMALE / MALE
    private Double weight;        // initial_weight_kg
    private Integer heightCm;
    private String fitnessLevel;  // BEGINNER / INTERMEDIATE / ADVANCED
    private String activityLevel; // SEDENTARY / MODERATE / ACTIVE
}
