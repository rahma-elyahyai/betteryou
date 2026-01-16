package ma.betteryou.betteryoubackend.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.dto.Profile.UserObjectiveDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileInfoDto;
import ma.betteryou.betteryoubackend.entity.enums.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class UserProfileControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User testUser;
    private String authToken;

    @BeforeEach
    void setUp() {
        // Nettoyer la base de données
        userRepository.deleteAll();

        // Créer un utilisateur de test
        testUser = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.com")
                .password(passwordEncoder.encode("password123"))
                .birthDate(LocalDate.of(1990, 1, 1))
                .gender(Gender.MALE)
                .goal(Goal.LOSE_WEIGHT)
                .heightCm(180)
                .initialWeightKg(new BigDecimal("85.0"))
                .activityLevel(ActivityLevel.MODERATE)
                .fitnessLevel(FitnessLevel.INTERMEDIATE)
                .build();

        testUser = userRepository.save(testUser);

        // Générer un token JWT pour les tests
        authToken = jwtService.generateToken(testUser.getEmail());
    }

    // ========== TESTS GET /api/profile ==========

    @Test
    @DisplayName("GET /api/profile avec token valide doit retourner le profil complet")
    void testGetProfileSuccess() throws Exception {
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info", notNullValue()))
                .andExpect(jsonPath("$.objective", notNullValue()))
                .andExpect(jsonPath("$.info.firstName", is("John")))
                .andExpect(jsonPath("$.info.lastName", is("Doe")))
                .andExpect(jsonPath("$.info.gender", is("MALE")))
                .andExpect(jsonPath("$.info.heightCm", is(180)))
                .andExpect(jsonPath("$.info.weight", is(85.0)))
                .andExpect(jsonPath("$.info.fitnessLevel", is("INTERMEDIATE")))
                .andExpect(jsonPath("$.info.activityLevel", is("MODERATE")))
                .andExpect(jsonPath("$.objective.goal", is("LOSE_WEIGHT")));
    }

    @Test
    @DisplayName("GET /api/profile sans token doit retourner 403")
    void testGetProfileWithoutToken() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/profile avec token invalide doit retourner 403")
    void testGetProfileWithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer invalid-token-xyz"))
                .andExpect(status().isForbidden());
    }

    // ========== TESTS PUT /api/profile/info ==========

    @Test
    @DisplayName("PUT /api/profile/info avec des données valides doit mettre à jour les informations")
    void testUpdateProfileInfoSuccess() throws Exception {
        UserProfileInfoDto updateDto = UserProfileInfoDto.builder()
                .firstName("Jane")
                .lastName("Smith")
                .birthDate(LocalDate.of(1992, 5, 15))
                .gender("FEMALE")
                .weight(65.0)
                .heightCm(170)
                .fitnessLevel("ADVANCED")
                .activityLevel("ACTIVE")
                .build();

        mockMvc.perform(put("/api/profile/info")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Jane")))
                .andExpect(jsonPath("$.lastName", is("Smith")))
                .andExpect(jsonPath("$.gender", is("FEMALE")))
                .andExpect(jsonPath("$.weight", is(65.0)))
                .andExpect(jsonPath("$.heightCm", is(170)))
                .andExpect(jsonPath("$.fitnessLevel", is("ADVANCED")))
                .andExpect(jsonPath("$.activityLevel", is("ACTIVE")));

        // Vérifier que les données ont bien été persistées
        User updatedUser = userRepository.findById(testUser.getIdUser()).orElseThrow();
        assert updatedUser.getFirstName().equals("Jane");
        assert updatedUser.getLastName().equals("Smith");
    }

    @Test
    @DisplayName("PUT /api/profile/info sans token doit retourner 403")
    void testUpdateProfileInfoWithoutToken() throws Exception {
        UserProfileInfoDto updateDto = UserProfileInfoDto.builder()
                .firstName("Jane")
                .lastName("Smith")
                .build();

        mockMvc.perform(put("/api/profile/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("PUT /api/profile/info avec modification partielle doit fonctionner")
    void testUpdateProfileInfoPartial() throws Exception {
        UserProfileInfoDto updateDto = UserProfileInfoDto.builder()
                .firstName("UpdatedFirstName")
                .lastName("Doe") // Garde le même
                .birthDate(testUser.getBirthDate())
                .gender("MALE")
                .weight(80.0) // Nouvelle valeur
                .heightCm(180)
                .fitnessLevel("INTERMEDIATE")
                .activityLevel("MODERATE")
                .build();

        mockMvc.perform(put("/api/profile/info")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("UpdatedFirstName")))
                .andExpect(jsonPath("$.weight", is(80.0)));
    }

    // ========== TESTS PUT /api/profile/objective ==========

    @Test
    @DisplayName("PUT /api/profile/objective avec des données valides doit mettre à jour l'objectif")
    void testUpdateObjectiveSuccess() throws Exception {
        UserObjectiveDto objectiveDto = UserObjectiveDto.builder()
                .goal("GAIN_MASS")
                .targetWeight(90.0)
                .build();

        mockMvc.perform(put("/api/profile/objective")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(objectiveDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goal", is("GAIN_MASS")))
                .andExpect(jsonPath("$.targetWeight", is(90.0)));

        // Vérifier que les données ont bien été persistées
        User updatedUser = userRepository.findById(testUser.getIdUser()).orElseThrow();
        assert updatedUser.getGoal() == Goal.GAIN_MASS;
    }

    @Test
    @DisplayName("PUT /api/profile/objective sans targetWeight doit fonctionner")
    void testUpdateObjectiveWithoutTargetWeight() throws Exception {
        UserObjectiveDto objectiveDto = UserObjectiveDto.builder()
                .goal("MAINTAIN")
                .targetWeight(null) // Optionnel
                .build();

        mockMvc.perform(put("/api/profile/objective")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(objectiveDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goal", is("MAINTAIN")));
    }

    @Test
    @DisplayName("PUT /api/profile/objective sans token doit retourner 403")
    void testUpdateObjectiveWithoutToken() throws Exception {
        UserObjectiveDto objectiveDto = UserObjectiveDto.builder()
                .goal("GAIN_MUSCLE")
                .targetWeight(90.0)
                .build();

        mockMvc.perform(put("/api/profile/objective")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(objectiveDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("PUT /api/profile/objective avec token invalide doit retourner 403")
    void testUpdateObjectiveWithInvalidToken() throws Exception {
        UserObjectiveDto objectiveDto = UserObjectiveDto.builder()
                .goal("GAIN_MUSCLE")
                .targetWeight(90.0)
                .build();

        mockMvc.perform(put("/api/profile/objective")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(objectiveDto)))
                .andExpect(status().isForbidden());
    }

    // ========== TESTS DE SCÉNARIOS COMPLETS ==========

    @Test
    @DisplayName("Scénario complet: GET -> UPDATE INFO -> UPDATE OBJECTIVE -> GET")
    void testCompleteProfileUpdateFlow() throws Exception {
        // 1. Récupérer le profil initial
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.firstName", is("John")))
                .andExpect(jsonPath("$.objective.goal", is("LOSE_WEIGHT")));

        // 2. Mettre à jour les informations personnelles
        UserProfileInfoDto updateInfo = UserProfileInfoDto.builder()
                .firstName("Johnny")
                .lastName("Doe")
                .birthDate(LocalDate.of(1990, 1, 1))
                .gender("MALE")
                .weight(82.0) // Perte de poids
                .heightCm(180)
                .fitnessLevel("ADVANCED") // Amélioration du niveau
                .activityLevel("ACTIVE")
                .build();

        mockMvc.perform(put("/api/profile/info")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Johnny")))
                .andExpect(jsonPath("$.weight", is(82.0)))
                .andExpect(jsonPath("$.fitnessLevel", is("ADVANCED")));

        // 3. Mettre à jour l'objectif
        UserObjectiveDto updateObjective = UserObjectiveDto.builder()
                .goal("MAINTAIN")
                .targetWeight(82.0)
                .build();

        mockMvc.perform(put("/api/profile/objective")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateObjective)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goal", is("MAINTAIN")))
                .andExpect(jsonPath("$.targetWeight", is(82.0)));

        // 4. Vérifier que tout a été mis à jour
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.firstName", is("Johnny")))
                .andExpect(jsonPath("$.info.weight", is(82.0)))
                .andExpect(jsonPath("$.info.fitnessLevel", is("ADVANCED")))
                .andExpect(jsonPath("$.objective.goal", is("MAINTAIN")))
                .andExpect(jsonPath("$.objective.targetWeight", is(82.0)));
    }

    @Test
    @DisplayName("Plusieurs utilisateurs ne doivent pas pouvoir modifier le profil d'un autre")
    void testUserCannotAccessOtherUserProfile() throws Exception {
        // Créer un deuxième utilisateur
        User otherUser = User.builder()
                .firstName("Alice")
                .lastName("Wonder")
                .email("alice@test.com")
                .password(passwordEncoder.encode("password456"))
                .birthDate(LocalDate.of(1995, 5, 5))
                .gender(Gender.FEMALE)
                .goal(Goal.GAIN_MASS)
                .heightCm(165)
                .initialWeightKg(new BigDecimal("60.0"))
                .activityLevel(ActivityLevel.ACTIVE)
                .fitnessLevel(FitnessLevel.BEGINNER)
                .build();

        otherUser = userRepository.save(otherUser);
        String otherUserToken = jwtService.generateToken(otherUser.getEmail());

        // Alice récupère son propre profil
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + otherUserToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.firstName", is("Alice")))
                .andExpect(jsonPath("$.info.email").doesNotExist()); // Pas d'email exposé

        // John récupère son profil
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.firstName", is("John")));

        // Les deux profils sont bien séparés
        User johnFromDb = userRepository.findById(testUser.getIdUser()).orElseThrow();
        User aliceFromDb = userRepository.findById(otherUser.getIdUser()).orElseThrow();

        assert !johnFromDb.getIdUser().equals(aliceFromDb.getIdUser());
    }

    @Test
    @DisplayName("Mise à jour avec des valeurs extrêmes valides doit fonctionner")
    void testUpdateWithExtremeValues() throws Exception {
        UserProfileInfoDto extremeDto = UserProfileInfoDto.builder()
                .firstName("Test")
                .lastName("User")
                .birthDate(LocalDate.of(1950, 1, 1)) // Personne âgée
                .gender("MALE")
                .weight(120.0) // Poids élevé mais valide
                .heightCm(200) // Grande taille mais valide
                .fitnessLevel("BEGINNER")
                .activityLevel("SEDENTARY")
                .build();

        mockMvc.perform(put("/api/profile/info")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(extremeDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.weight", is(120.0)))
                .andExpect(jsonPath("$.heightCm", is(200)));
    }
}
