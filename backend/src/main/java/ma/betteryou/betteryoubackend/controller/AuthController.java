package ma.betteryou.betteryoubackend.controller;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.DTO.AuthResponse;
import ma.betteryou.betteryoubackend.DTO.LoginRequest;
import ma.betteryou.betteryoubackend.DTO.RegisterRequest;
import ma.betteryou.betteryoubackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<AuthResponse>register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse>login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

}
