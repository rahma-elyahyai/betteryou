package ma.betteryou.betteryoubackend.service.auth;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.auth.*;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ma.betteryou.betteryoubackend.entity.auth.PasswordResetToken;
import ma.betteryou.betteryoubackend.repository.PasswordResetTokenRepository;
import ma.betteryou.betteryoubackend.service.mail.EmailService;
import org.springframework.beans.factory.annotation.Value;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthService {
    //La logique métier de l’authentification

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.reset-url}")
    private String resetUrl;



    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtService.generateToken(req.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email already used");
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


    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {
    var userOpt = userRepository.findByEmail(req.getEmail());

    // sécurité : on renvoie "OK" même si email n'existe pas
    if (userOpt.isEmpty()) return;

    var user = userOpt.get();

    // optionnel : supprimer anciens tokens pour ce user
    passwordResetTokenRepository.deleteByUser_IdUser(user.getIdUser());

    String rawtoken = UUID.randomUUID().toString();//generation token temporaire
    String token = sha256(rawtoken); //hashage token pour securite

    PasswordResetToken prt = PasswordResetToken.builder()
            .token(token)//stocker le token hashé
            .user(user)
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .used(false)
            .build();

    passwordResetTokenRepository.save(prt);

    // Lien frontend (à adapter selon votre app)
    String resetLink = resetUrl + "?token=" + rawtoken;
    emailService.sendResetLink(user.getEmail(), resetLink);

}

public void resetPassword(ResetPasswordRequest req) {
    String tokenHash = sha256(req.getToken());

    PasswordResetToken prt = passwordResetTokenRepository.findByToken(tokenHash)
        .orElseThrow(() -> new IllegalArgumentException("Invalid token"));


    if (prt.isUsed()) {
        throw new IllegalArgumentException("Token already used");
    }

    if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException("Token expired");
    }

    var user = prt.getUser();
    user.setPassword(passwordEncoder.encode(req.getNewPassword()));
    userRepository.save(user);

    prt.setUsed(true);
    passwordResetTokenRepository.save(prt);
}

private String sha256(String input) {
    try {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) sb.append(String.format("%02x", b));
        return sb.toString();
    } catch (NoSuchAlgorithmException e) {
        throw new IllegalStateException("SHA-256 not available", e);
    }
}


}
