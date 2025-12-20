package ma.betteryou.betteryoubackend.service.profile;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Profile.UserObjectiveDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileInfoDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileResponseDto;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.enums.*;
import ma.betteryou.betteryoubackend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;

    @Override
    public UserProfileResponseDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileInfoDto info = UserProfileInfoDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .birthDate(user.getBirthDate()) 
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .weight(user.getInitialWeightKg() != null ? user.getInitialWeightKg().doubleValue() : null)
                .heightCm(user.getHeightCm())
                .fitnessLevel(user.getFitnessLevel() != null ? user.getFitnessLevel().name() : null)
                .activityLevel(user.getActivityLevel() != null ? user.getActivityLevel().name() : null)
                .build();

        UserObjectiveDto objective = UserObjectiveDto.builder()
                .goal(user.getGoal() != null ? user.getGoal().name() : null)
                .targetWeight(user.getTargetWeightKg() != null ? user.getTargetWeightKg().doubleValue() : null)
                .build();

        return UserProfileResponseDto.builder()
                .info(info)
                .objective(objective)
                .build();
    }

    @Override
    public UserProfileInfoDto updateProfileInfo(Long userId, UserProfileInfoDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());

        if (dto.getGender() != null) {
            user.setGender(Gender.valueOf(dto.getGender()));
        }

        if (dto.getWeight() != null) {
            user.setInitialWeightKg(BigDecimal.valueOf(dto.getWeight()));
        }

        user.setHeightCm(dto.getHeightCm());

        if (dto.getFitnessLevel() != null) {
            user.setFitnessLevel(FitnessLevel.valueOf(dto.getFitnessLevel()));
        }

        if (dto.getActivityLevel() != null) {
            user.setActivityLevel(ActivityLevel.valueOf(dto.getActivityLevel()));
        }

        userRepository.save(user);

        return dto;
    }

    @Override
    public UserObjectiveDto updateObjective(Long userId, UserObjectiveDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getGoal() != null) {
            user.setGoal(Goal.valueOf(dto.getGoal()));
        }

        if (dto.getTargetWeight() != null) {
            user.setTargetWeightKg(BigDecimal.valueOf(dto.getTargetWeight()));
        }

        userRepository.save(user);

        return dto;
    }
}
