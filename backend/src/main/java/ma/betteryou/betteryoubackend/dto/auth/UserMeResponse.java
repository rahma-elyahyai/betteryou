package ma.betteryou.betteryoubackend.dto.auth;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

import ma.betteryou.betteryoubackend.entity.enums.ActivityLevel;
import ma.betteryou.betteryoubackend.entity.enums.FitnessLevel;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.Gender;





@Data
@Builder
public class UserMeResponse {
    private Long idUser;
    private String firstName;
    private String lastName;
    private String email;
    private Gender gender;
    private Goal goal;
    private Integer heightCm;
    private BigDecimal  initialWeightKg;
    private ActivityLevel activityLevel;
    private FitnessLevel fitnessLevel;
}
