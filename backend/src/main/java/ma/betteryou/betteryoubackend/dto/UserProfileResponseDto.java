package ma.betteryou.betteryoubackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDto {

    private UserProfileInfoDto info;
    private UserObjectiveDto objective;
}
