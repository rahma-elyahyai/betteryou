package ma.betteryou.betteryoubackend.controller.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.auth.*;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ma.betteryou.betteryoubackend.dto.auth.ForgotPasswordRequest;
import ma.betteryou.betteryoubackend.dto.auth.ResetPasswordRequest;
import ma.betteryou.betteryoubackend.dto.auth.MessageResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody @Valid RegisterRequest req) {
        return authService.register(req);
    }

    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> me(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.me(auth.getName()));
    }

    @GetMapping("/check-email")
    public boolean checkEmail(@RequestParam String email) {
        return !userRepository.existsByEmail(email);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@RequestBody @Valid ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        return new MessageResponse("If the email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@RequestBody @Valid ResetPasswordRequest req) {
        authService.resetPassword(req);
        return new MessageResponse("Password updated successfully.");
    }

}
