package ma.betteryou.betteryoubackend.service.auth;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.auth.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    //La logique métier de l’authentification

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtService.generateToken(req.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already used");
        }

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .birthDate(req.getBirthDate())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .gender(req.getGender())
                .goal(req.getGoal())
                .heightCm(req.getHeightCm())
                .initialWeightKg(req.getInitialWeightKg())
                .activityLevel(req.getActivityLevel())
                .fitnessLevel(req.getFitnessLevel())
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    public UserMeResponse me(String email) {
        var u = userRepository.findByEmail(email).orElseThrow();
        return UserMeResponse.builder()
                .idUser(u.getIdUser())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .gender(u.getGender())
                .goal(u.getGoal())
                .heightCm(u.getHeightCm())
                .initialWeightKg(u.getInitialWeightKg())
                .activityLevel(u.getActivityLevel())
                .fitnessLevel(u.getFitnessLevel())
                .build();
    }
}
