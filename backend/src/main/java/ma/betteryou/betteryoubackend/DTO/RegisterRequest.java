package ma.betteryou.betteryoubackend.DTO;


import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
    @NotNull @Past private LocalDate birthDate;
    @NotBlank @Pattern(regexp = "MALE|FEMALE") private String gender;
    @NotNull @Min(100) @Max(250) private Integer heightCm;
    @NotNull @DecimalMin("30.0") @DecimalMax("300.0") private BigDecimal initialWeightKg;
    @NotNull @DecimalMin("30.0") @DecimalMax("300.0") private BigDecimal targetWeightKg;
    @NotBlank @Pattern(regexp = "LOSE_WEIGHT|MAINTAIN|GAIN_MASS") private String goal;
    @NotBlank @Pattern(regexp = "BEGINNER|INTERMEDIATE|ADVANCED") private String fitnessLevel;
    @NotBlank @Pattern(regexp = "SEDENTARY|MODERATE|ACTIVE") private String activityLevel;
}