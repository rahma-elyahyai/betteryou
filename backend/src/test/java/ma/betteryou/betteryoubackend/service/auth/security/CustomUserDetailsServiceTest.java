package ma.betteryou.betteryoubackend.service.auth.security;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.security.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

//import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.Assertions.assertThat;

import static org.mockito.Mockito.when;
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        // Given
        User user = User.builder().email("test@test.com").password("pass").build();
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        // When
        var userDetails = userDetailsService.loadUserByUsername("test@test.com");

        // Then
        assertThat(userDetails.getUsername()).isEqualTo("test@test.com");
        assertThat(userDetails.getAuthorities()).extracting("authority").contains("ROLE_USER");
    }
}
