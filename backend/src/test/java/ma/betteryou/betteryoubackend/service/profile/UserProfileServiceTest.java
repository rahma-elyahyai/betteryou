package ma.betteryou.betteryoubackend.service.profile;

import ma.betteryou.betteryoubackend.dto.Profile.UserObjectiveDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileInfoDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileResponseDto;
import ma.betteryou.betteryoubackend.entity.enums.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserProfileServiceImpl userProfileService;

    private User testUser;
    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
        testUser = User.builder()
                .idUser(userId)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .birthDate(LocalDate.of(1990, 1, 1))
                .gender(Gender.MALE)
                .heightCm(180)
                .initialWeightKg(new BigDecimal("80.0"))
                .goal(Goal.LOSE_WEIGHT)
                .targetWeightKg(new BigDecimal("70.0"))
                .fitnessLevel(FitnessLevel.INTERMEDIATE)
                .activityLevel(ActivityLevel.MODERATE)
                .build();
    }

    @Test
    @DisplayName("getProfileByUserId doit retourner un UserProfileResponseDto complet")
    void getProfileByUserId_ShouldReturnCompleteProfile() {
        // Given
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // When
        UserProfileResponseDto response = userProfileService.getProfileByUserId(userId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getInfo()).isNotNull();
        assertThat(response.getInfo().getFirstName()).isEqualTo("John");
        assertThat(response.getInfo().getLastName()).isEqualTo("Doe");
        assertThat(response.getInfo().getHeightCm()).isEqualTo(180);
        assertThat(response.getInfo().getWeight()).isEqualTo(80.0);
        assertThat(response.getInfo().getGender()).isEqualTo("MALE");
        assertThat(response.getInfo().getFitnessLevel()).isEqualTo("INTERMEDIATE");
        assertThat(response.getInfo().getActivityLevel()).isEqualTo("MODERATE");

        assertThat(response.getObjective()).isNotNull();
        assertThat(response.getObjective().getGoal()).isEqualTo("LOSE_WEIGHT");
        assertThat(response.getObjective().getTargetWeight()).isEqualTo(70.0);
    }

    @Test
    @DisplayName("getProfileByUserId doit lever une exception si l'utilisateur n'existe pas")
    void getProfileByUserId_ShouldThrowException_WhenUserNotFound() {
        // Given
        Long nonExistentUserId = 999L;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userProfileService.getProfileByUserId(nonExistentUserId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("updateProfileInfo doit mettre à jour les informations utilisateur")
    void updateProfileInfo_ShouldUpdateUserInfo() {
        // Given
        UserProfileInfoDto dto = UserProfileInfoDto.builder()
                .firstName("Jane")
                .lastName("Smith")
                .heightCm(170)
                .weight(65.0)
                .gender("FEMALE")
                .fitnessLevel("ADVANCED")
                .activityLevel("ACTIVE")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserProfileInfoDto result = userProfileService.updateProfileInfo(userId, dto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("Jane");
        assertThat(result.getLastName()).isEqualTo("Smith");
        assertThat(result.getHeightCm()).isEqualTo(170);
        assertThat(result.getWeight()).isEqualTo(65.0);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("updateProfileInfo doit lever une exception si l'utilisateur n'existe pas")
    void updateProfileInfo_ShouldThrowException_WhenUserNotFound() {
        // Given
        Long nonExistentUserId = 999L;
        UserProfileInfoDto dto = UserProfileInfoDto.builder()
                .firstName("Jane")
                .build();

        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userProfileService.updateProfileInfo(nonExistentUserId, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("updateObjective doit mettre à jour l'objectif utilisateur")
    void updateObjective_ShouldUpdateUserObjective() {
        // Given
        UserObjectiveDto dto = UserObjectiveDto.builder()
                .goal("GAIN_MASS")
                .targetWeight(85.0)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserObjectiveDto result = userProfileService.updateObjective(userId, dto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getGoal()).isEqualTo("GAIN_MASS");
        assertThat(result.getTargetWeight()).isEqualTo(85.0);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("updateObjective doit lever une exception si l'utilisateur n'existe pas")
    void updateObjective_ShouldThrowException_WhenUserNotFound() {
        // Given
        Long nonExistentUserId = 999L;
        UserObjectiveDto dto = UserObjectiveDto.builder()
                .goal("GAIN_MASS")
                .build();

        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userProfileService.updateObjective(nonExistentUserId, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("getProfileByUserId doit gérer les valeurs null correctement")
    void getProfileByUserId_ShouldHandleNullValues() {
        // Given
        User userWithNulls = User.builder()
                .idUser(userId)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .gender(null)
                .goal(null)
                .fitnessLevel(null)
                .activityLevel(null)
                .initialWeightKg(null)
                .targetWeightKg(null)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(userWithNulls));

        // When
        UserProfileResponseDto response = userProfileService.getProfileByUserId(userId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getInfo().getGender()).isNull();
        assertThat(response.getInfo().getFitnessLevel()).isNull();
        assertThat(response.getInfo().getActivityLevel()).isNull();
        assertThat(response.getObjective().getGoal()).isNull();
        assertThat(response.getObjective().getTargetWeight()).isNull();
    }
}
