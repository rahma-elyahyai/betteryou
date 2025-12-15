package ma.betteryou.betteryoubackend.service;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.DTO.AuthResponse;
import ma.betteryou.betteryoubackend.DTO.LoginRequest;
import ma.betteryou.betteryoubackend.DTO.RegisterRequest;
import ma.betteryou.betteryoubackend.entity.enums.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Créer le nouvel utilisateur
        var user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBirthDate(request.getBirthDate());
        user.setGender(Gender.valueOf(request.getGender()));
        user.setHeightCm(request.getHeightCm());
        user.setInitialWeightKg(request.getInitialWeightKg());
        user.setTargetWeightKg(request.getTargetWeightKg());
        user.setGoal(Goal.valueOf(request.getGoal()));
        user.setFitnessLevel(FitnessLevel.valueOf(request.getFitnessLevel()));
        user.setActivityLevel(ActivityLevel.valueOf(request.getActivityLevel()));

        userRepository.save(user);

        //j'ai choisi de mettre que userId dans payload du token
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getIdUser());

        // Générer le token avec userId dans les claims
        //var userDetails = new UserDetailsServiceImp(user);
        var jwtToken = jwtService.generateToken(extraClaims, user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(Long.valueOf(user.getIdUser()))
                .message("Inscription réussie")
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        // 1) Demander à Spring Security de vérifier email + password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2) Charger l'utilisateur après authentification
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 3) Ajouter l'userId dans les claims comme register()
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getIdUser());

        // 4) Générer le token (email dans subject, userId dans claims)
        var jwtToken = jwtService.generateToken(extraClaims, user);

        // 5) Retourner la réponse
        return AuthResponse.builder()
                .token(jwtToken)
                .userId(Long.valueOf(user.getIdUser()))
                .message("Connexion réussie")
                .build();
    }

}
