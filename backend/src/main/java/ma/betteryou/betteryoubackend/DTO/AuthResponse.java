package ma.betteryou.betteryoubackend.DTO;

import lombok.Data;

@Data
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;  // Pour permettre au client de faire des requêtes ultérieures
    private String message;
}
