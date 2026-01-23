package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.enums.Gender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // Configure une DB H2, scanne les entités et configure Spring Data JPA
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        // Préparation d'un objet User de base pour les tests
        user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .gender(Gender.MALE)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Il doit sauvegarder un utilisateur avec succès")
    void saveUser_shouldPersistUser() {
        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getIdUser()).isGreaterThan(0);
        assertThat(savedUser.getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    @DisplayName("Il doit trouver un utilisateur par son email")
    void findByEmail_shouldReturnUser_whenEmailExists() {
        // Given
        userRepository.save(user);

        // When
        Optional<User> foundUser = userRepository.findByEmail("john.doe@example.com");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    @DisplayName("Il doit retourner vide si l'email n'existe pas")
    void findByEmail_shouldReturnEmpty_whenEmailDoesNotExist() {
        // When
        Optional<User> foundUser = userRepository.findByEmail("notfound@example.com");

        // Then
        assertThat(foundUser).isEmpty();
    }

    @Test
    @DisplayName("Il doit retourner vrai si l'email existe")
    void existsByEmail_shouldReturnTrue_whenEmailExists() {
        // Given
        userRepository.save(user);

        // When
        boolean exists = userRepository.existsByEmail("john.doe@example.com");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Il doit retourner faux si l'email n'existe pas")
    void existsByEmail_shouldReturnFalse_whenEmailDoesNotExist() {
        // When
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("Il doit supprimer un utilisateur")
    void deleteUser_shouldRemoveUser() {
        // Given
        User savedUser = userRepository.save(user);

        // When
        userRepository.deleteById(savedUser.getIdUser());
        Optional<User> deletedUser = userRepository.findById(savedUser.getIdUser());

        // Then
        assertThat(deletedUser).isEmpty();
    }
}
