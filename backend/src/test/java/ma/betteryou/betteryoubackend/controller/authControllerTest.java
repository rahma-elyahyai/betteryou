package ma.betteryou.betteryoubackend.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.controller.auth.AuthController;
import ma.betteryou.betteryoubackend.dto.auth.*;
import ma.betteryou.betteryoubackend.entity.enums.*;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.AuthService;
import ma.betteryou.betteryoubackend.service.auth.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;


import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false) // Désactive les filtres de sécurité pour isoler le test du controller
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Login doit retourner un token 200 OK")
    void login_ShouldReturnAuthResponse() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("user@test.com", "password123");
        AuthResponse response = new AuthResponse("mock-jwt-token");
        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));
    }
    @Test
    void register_ShouldReturnAuthResponse() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setBirthDate(LocalDate.of(1995, 1, 1));
        request.setGender(Gender.MALE);
        request.setGoal(Goal.LOSE_WEIGHT);
        request.setHeightCm(175);
        request.setInitialWeightKg(new BigDecimal("75.0"));
        request.setActivityLevel(ActivityLevel.MODERATE);
        request.setFitnessLevel(FitnessLevel.INTERMEDIATE);

        AuthResponse response = new AuthResponse("new-token");
        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("new-token"));
    }

    @Test
    @DisplayName("Check-email doit retourner true si l'email est disponible")
    void checkEmail_ShouldReturnTrue_WhenEmailNotExists() throws Exception {
        // Given
        String email = "free@test.com";
        when(userRepository.existsByEmail(email)).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/auth/check-email").param("email", email))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}
