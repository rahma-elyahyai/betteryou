package ma.betteryou.betteryoubackend.dto.Profile;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserObjectiveDto {

    private String goal;          // LOSE_WEIGHT / MAINTAIN / GAIN_MASS
    private Double targetWeight;  // optionnel
}
