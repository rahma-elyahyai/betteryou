package ma.betteryou.betteryoubackend.controller.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.auth.*;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.auth.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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
    public UserMeResponse me(Authentication auth) {
        return authService.me(auth.getName()); // auth.getName() = email (subject)
    }

    @GetMapping("/check-email")
    public boolean checkEmail(@RequestParam String email) {
        return !userRepository.existsByEmail(email);
    }
}
