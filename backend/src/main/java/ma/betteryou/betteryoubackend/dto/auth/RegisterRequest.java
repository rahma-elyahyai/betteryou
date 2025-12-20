package ma.betteryou.betteryoubackend.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

import ma.betteryou.betteryoubackend.entity.enums.Gender;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.ActivityLevel;
import ma.betteryou.betteryoubackend.entity.enums.FitnessLevel;



@Data
public class RegisterRequest {

    // Step 1
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private LocalDate birthDate;

    @Email @NotBlank private String email;
    @NotBlank @Size(min = 8) private String password;

    @NotNull private Gender gender;

    // Step 2
    @NotNull private Goal goal;

    // Step 3
    @NotNull @Min(100) @Max(250)
    private Integer heightCm;

    @NotNull @DecimalMin("20.0") @DecimalMax("400.0")
    private BigDecimal  initialWeightKg;

    @NotNull private ActivityLevel activityLevel;
    @NotNull private FitnessLevel fitnessLevel;
}
