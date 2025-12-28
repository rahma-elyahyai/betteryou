package ma.betteryou.betteryoubackend.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.controller.auth.AuthController;
import ma.betteryou.betteryoubackend.dto.auth.*;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
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
    @DisplayName("Register doit retourner 200 OK")
    void register_ShouldReturnAuthResponse() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@test.com");
        AuthResponse response = new AuthResponse("new-token");
        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("new-token"));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("Me doit retourner les infos de l'utilisateur connecté")
    void me_ShouldReturnUserDetails() throws Exception {
        // Given
        UserMeResponse response = UserMeResponse.builder()
                .email("user@test.com")
                .firstName("John")
                .build();
        when(authService.me("user@test.com")).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@test.com"))
                .andExpect(jsonPath("$.firstName").value("John"));
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
