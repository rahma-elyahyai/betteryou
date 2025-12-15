package ma.betteryou.betteryoubackend.service;

import ma.betteryou.betteryoubackend.dto.*;

public interface UserProfileService {

    UserProfileResponseDto getProfileByUserId(Long userId);   

    UserProfileInfoDto updateProfileInfo(Long userId, UserProfileInfoDto dto);

    UserObjectiveDto updateObjective(Long userId, UserObjectiveDto dto);
}
