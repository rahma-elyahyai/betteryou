package ma.betteryou.betteryoubackend.service.auth.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    // Une clé secrète de test (doit faire au moins 32 caractères pour HS256)
    private final String secret = "ma_super_cle_secrete_de_test_32_caracteres_minimum";
    private final long expiration = 3600000; // 1 heure

    @BeforeEach
    void setUp() {
        // Initialisation manuelle car c'est un test unitaire pur
        jwtService = new JwtService(secret, expiration);
    }

    @Test
    @DisplayName("Le token généré ne doit pas être nul et doit contenir l'email")
    void generateToken_shouldCreateValidToken() {
        // Given
        String email = "user@betteryou.ma";

        // When
        String token = jwtService.generateToken(email);

        // Then
        assertThat(token).isNotNull();
        assertThat(jwtService.extractEmail(token)).isEqualTo(email);
    }

    @Test
    @DisplayName("isValid doit retourner true pour un token valide")
    void isValid_shouldReturnTrueForValidToken() {
        // Given
        String token = jwtService.generateToken("test@example.com");

        // When
        boolean valid = jwtService.isValid(token);

        // Then
        assertThat(valid).isTrue();
    }

    @Test
    @DisplayName("isValid doit retourner false pour un token corrompu")
    void isValid_shouldReturnFalseForInvalidToken() {
        // Given
        String invalidToken = "eyJhbGciOiJIUzI1NiJ9.invalid.token";

        // When
        boolean valid = jwtService.isValid(invalidToken);

        // Then
        assertThat(valid).isFalse();
    }

    @Test
    @DisplayName("isValid doit retourner false pour un token expiré")
    void isValid_shouldReturnFalseForExpiredToken() {
        // Given : Création d'un service avec une expiration de 0ms
        JwtService expiredJwtService = new JwtService(secret, -10000);
        String expiredToken = expiredJwtService.generateToken("expired@example.com");

        // When
        boolean valid = jwtService.isValid(expiredToken);

        // Then
        assertThat(valid).isFalse();
    }

    @Test
    @DisplayName("extractEmail doit retourner le bon sujet")
    void extractEmail_shouldReturnCorrectSubject() {
        // Given
        String email = "admin@betteryou.ma";
        String token = jwtService.generateToken(email);

        // When
        String extractedEmail = jwtService.extractEmail(token);

        // Then
        assertThat(extractedEmail).isEqualTo(email);
    }
}