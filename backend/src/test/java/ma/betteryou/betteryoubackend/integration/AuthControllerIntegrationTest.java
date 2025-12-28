package ma.betteryou.betteryoubackend.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.dto.auth.LoginRequest;
import ma.betteryou.betteryoubackend.dto.auth.RegisterRequest;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.enums.*;
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
class AuthControllerIntegrationTest {

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

    @BeforeEach
    void setUp() {
        // Nettoyer la base de données avant chaque test
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
                .initialWeightKg(new BigDecimal("80.0"))
                .activityLevel(ActivityLevel.MODERATE)
                .fitnessLevel(FitnessLevel.INTERMEDIATE)
                .build();

        userRepository.save(testUser);
    }

    // ========== TESTS DE LOGIN ==========

    @Test
    @DisplayName("Login avec des identifiants valides doit retourner un token")
    void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("john.doe@test.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.token", not(emptyString())));
    }

    @Test
    @DisplayName("Login avec un email invalide doit retourner 401")
    void testLoginWithInvalidEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest("wrong@test.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Login avec un mot de passe invalide doit retourner 401")
    void testLoginWithInvalidPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest("john.doe@test.com", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Login avec un email vide doit retourner 400")
    void testLoginWithEmptyEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest("", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Login avec un mot de passe vide doit retourner 400")
    void testLoginWithEmptyPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest("john.doe@test.com", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    // ========== TESTS DE REGISTER ==========

    @Test
    @DisplayName("Register avec des données valides doit créer un utilisateur et retourner un token")
    void testRegisterSuccess() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Smith");
        registerRequest.setEmail("jane.smith@test.com");
        registerRequest.setPassword("password456");
        registerRequest.setBirthDate(LocalDate.of(1995, 5, 15));
        registerRequest.setGender(Gender.FEMALE);
        registerRequest.setGoal(Goal.GAIN_MASS);
        registerRequest.setHeightCm(165);
        registerRequest.setInitialWeightKg(new BigDecimal("60.0"));
        registerRequest.setActivityLevel(ActivityLevel.ACTIVE);
        registerRequest.setFitnessLevel(FitnessLevel.BEGINNER);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.token", not(emptyString())));

        // Vérifier que l'utilisateur a bien été créé dans la base de données
        assert userRepository.existsByEmail("jane.smith@test.com");
    }

    @Test
    @DisplayName("Register avec un email déjà existant doit retourner une erreur")
    void testRegisterWithExistingEmail() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Duplicate");
        registerRequest.setEmail("john.doe@test.com"); // Email déjà utilisé
        registerRequest.setPassword("password789");
        registerRequest.setBirthDate(LocalDate.of(1992, 3, 20));
        registerRequest.setGender(Gender.MALE);
        registerRequest.setGoal(Goal.LOSE_WEIGHT);
        registerRequest.setHeightCm(175);
        registerRequest.setInitialWeightKg(new BigDecimal("75.0"));
        registerRequest.setActivityLevel(ActivityLevel.MODERATE);
        registerRequest.setFitnessLevel(FitnessLevel.INTERMEDIATE);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Register avec un email invalide doit retourner 400")
    void testRegisterWithInvalidEmail() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Invalid");
        registerRequest.setLastName("Email");
        registerRequest.setEmail("not-an-email"); // Email invalide
        registerRequest.setPassword("password789");
        registerRequest.setBirthDate(LocalDate.of(1992, 3, 20));
        registerRequest.setGender(Gender.MALE);
        registerRequest.setGoal(Goal.MAINTAIN);
        registerRequest.setHeightCm(175);
        registerRequest.setInitialWeightKg(new BigDecimal("75.0"));
        registerRequest.setActivityLevel(ActivityLevel.MODERATE);
        registerRequest.setFitnessLevel(FitnessLevel.INTERMEDIATE);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Register avec des champs requis manquants doit retourner 400")
    void testRegisterWithMissingFields() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Incomplete");
        // lastName manquant
        registerRequest.setEmail("incomplete@test.com");
        registerRequest.setPassword("password789");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    // ========== TESTS DE /me ==========

    @Test
    @DisplayName("Endpoint /me avec un token valide doit retourner les informations de l'utilisateur")
    void testMeWithValidToken() throws Exception {
        String token = jwtService.generateToken(testUser.getEmail());

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUser", notNullValue()))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.email", is("john.doe@test.com")))
                .andExpect(jsonPath("$.gender", is("MALE")))
                .andExpect(jsonPath("$.goal", is("LOSE_WEIGHT")))
                .andExpect(jsonPath("$.heightCm", is(180)))
                .andExpect(jsonPath("$.initialWeightKg", is(80.0)))
                .andExpect(jsonPath("$.activityLevel", is("MODERATE")))
                .andExpect(jsonPath("$.fitnessLevel", is("INTERMEDIATE")));
    }

    @Test
    @DisplayName("Endpoint /me sans token doit retourner 403")
    void testMeWithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Endpoint /me avec un token invalide doit retourner 403")
    void testMeWithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isForbidden());
    }

    // ========== TESTS DE /check-email ==========

    @Test
    @DisplayName("Check-email avec un email disponible doit retourner true")
    void testCheckEmailAvailable() throws Exception {
        mockMvc.perform(get("/api/auth/check-email")
                        .param("email", "available@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    @DisplayName("Check-email avec un email déjà utilisé doit retourner false")
    void testCheckEmailAlreadyUsed() throws Exception {
        mockMvc.perform(get("/api/auth/check-email")
                        .param("email", "john.doe@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    // ========== TESTS DE SCÉNARIOS COMPLETS ==========

    @Test
    @DisplayName("Scénario complet: Register -> Login -> Me")
    void testCompleteAuthFlow() throws Exception {
        // 1. Register
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Alice");
        registerRequest.setLastName("Wonder");
        registerRequest.setEmail("alice@test.com");
        registerRequest.setPassword("alicepass123");
        registerRequest.setBirthDate(LocalDate.of(1988, 8, 8));
        registerRequest.setGender(Gender.FEMALE);
        registerRequest.setGoal(Goal.LOSE_WEIGHT);
        registerRequest.setHeightCm(170);
        registerRequest.setInitialWeightKg(new BigDecimal("70.0"));
        registerRequest.setActivityLevel(ActivityLevel.ACTIVE);
        registerRequest.setFitnessLevel(FitnessLevel.BEGINNER);

        String registerResponse = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // 2. Login avec les mêmes identifiants
        LoginRequest loginRequest = new LoginRequest("alice@test.com", "alicepass123");

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Extraire le token de la réponse
        String token = objectMapper.readTree(loginResponse).get("token").asText();

        // 3. Appeler /me avec le token
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Alice")))
                .andExpect(jsonPath("$.lastName", is("Wonder")))
                .andExpect(jsonPath("$.email", is("alice@test.com")));
    }
}