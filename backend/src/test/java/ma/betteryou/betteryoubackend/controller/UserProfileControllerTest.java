package ma.betteryou.betteryoubackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.dto.Profile.UserObjectiveDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileInfoDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileResponseDto;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.profile.UserProfileService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserProfileController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Authentication mockAuthentication;
    private User testUser;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        testUser = User.builder()
                .idUser(1L)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .build();

        mockAuthentication = org.springframework.security.authentication.UsernamePasswordAuthenticationToken
                .authenticated("test@example.com", null, new ArrayList<>());

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("GET /api/profile doit retourner le profil utilisateur")
    void getProfile_ShouldReturnUserProfile() throws Exception {
        // Given
        UserProfileResponseDto response = UserProfileResponseDto.builder()
                .info(UserProfileInfoDto.builder()
                        .firstName("John")
                        .lastName("Doe")
                        .heightCm(180)
                        .build())
                .objective(UserObjectiveDto.builder()
                        .goal("LOSE_WEIGHT")
                        .targetWeight(70.0)
                        .build())
                .build();

        when(userProfileService.getProfileByUserId(1L)).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/profile")
                        .with(authentication(mockAuthentication))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.firstName").value("John"))
                .andExpect(jsonPath("$.info.lastName").value("Doe"))
                .andExpect(jsonPath("$.objective.goal").value("LOSE_WEIGHT"));
    }

    @Test
    @DisplayName("PUT /api/profile/info doit mettre à jour les informations du profil")
    void updateInfo_ShouldUpdateProfileInfo() throws Exception {
        // Given
        UserProfileInfoDto requestDto = UserProfileInfoDto.builder()
                .firstName("Jane")
                .lastName("Smith")
                .heightCm(170)
                .weight(65.0)
                .gender("FEMALE")
                .fitnessLevel("INTERMEDIATE")
                .activityLevel("MODERATE")
                .build();

        UserProfileInfoDto responseDto = UserProfileInfoDto.builder()
                .firstName("Jane")
                .lastName("Smith")
                .heightCm(170)
                .build();

        when(userProfileService.updateProfileInfo(any(Long.class), any(UserProfileInfoDto.class)))
                .thenReturn(responseDto);

        // When & Then
        mockMvc.perform(put("/api/profile/info")
                        .with(authentication(mockAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Smith"))
                .andExpect(jsonPath("$.heightCm").value(170));
    }

    @Test
    @DisplayName("PUT /api/profile/objective doit mettre à jour l'objectif utilisateur")
    void updateObjective_ShouldUpdateObjective() throws Exception {
        // Given
        UserObjectiveDto requestDto = UserObjectiveDto.builder()
                .goal("GAIN_MASS")
                .targetWeight(80.0)
                .build();

        UserObjectiveDto responseDto = UserObjectiveDto.builder()
                .goal("GAIN_MASS")
                .targetWeight(80.0)
                .build();

        when(userProfileService.updateObjective(any(Long.class), any(UserObjectiveDto.class)))
                .thenReturn(responseDto);

        // When & Then
        mockMvc.perform(put("/api/profile/objective")
                        .with(authentication(mockAuthentication))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goal").value("GAIN_MASS"))
                .andExpect(jsonPath("$.targetWeight").value(80.0));
    }

    @Test
    @DisplayName("GET /api/profile doit lever une exception si l'utilisateur n'existe pas")
    void getProfile_ShouldThrowException_WhenUserNotFound() throws Exception {
        // Given
        Authentication authWithNonExistentUser = org.springframework.security.authentication.UsernamePasswordAuthenticationToken
                .authenticated("nonexistent@example.com", null, new ArrayList<>());

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/profile")
                        .with(authentication(authWithNonExistentUser))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is5xxServerError());
    }
}
