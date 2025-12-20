package ma.betteryou.betteryoubackend.service.profile;

import ma.betteryou.betteryoubackend.dto.Profile.UserObjectiveDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileInfoDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileResponseDto;

public interface UserProfileService {

    UserProfileResponseDto getProfileByUserId(Long userId);   

    UserProfileInfoDto updateProfileInfo(Long userId, UserProfileInfoDto dto);

    UserObjectiveDto updateObjective(Long userId, UserObjectiveDto dto);
}
