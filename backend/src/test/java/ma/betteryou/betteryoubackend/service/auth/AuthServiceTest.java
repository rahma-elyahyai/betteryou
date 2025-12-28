package ma.betteryou.betteryoubackend.service.auth;

import ma.betteryou.betteryoubackend.dto.auth.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldSaveUserAndReturnToken_WhenEmailIsNew() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@test.com");
        request.setPassword("password");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(jwtService.generateToken(anyString())).thenReturn("mock-jwt-token");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@test.com");
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email already used");
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() {
        // Given
        LoginRequest request = new LoginRequest("test@test.com", "password");
        when(jwtService.generateToken(request.getEmail())).thenReturn("mock-token");

        // When
        AuthResponse response = authService.login(request);

        // Then
        assertThat(response.getToken()).isEqualTo("mock-token");
        verify(authenticationManager).authenticate(any());
    }
}