package ma.betteryou.betteryoubackend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    private String token;

    @NotBlank
    @jakarta.validation.constraints.Size(min = 8)
    private String newPassword;
}
