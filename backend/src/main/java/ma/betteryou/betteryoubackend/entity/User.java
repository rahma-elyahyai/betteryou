package ma.betteryou.betteryoubackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.betteryou.betteryoubackend.enums.ActivityLevel;
import ma.betteryou.betteryoubackend.enums.FitnessLevel;
import ma.betteryou.betteryoubackend.enums.Gender;
import ma.betteryou.betteryoubackend.enums.Goal;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Integer heightCm;
    private BigDecimal initialWeightKg;
    private BigDecimal targetWeightKg;

    @Enumerated(EnumType.STRING)
    private Goal goal;

    @Enumerated(EnumType.STRING)
    private FitnessLevel fitnessLevel;

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    private LocalDateTime createdAt;
}



