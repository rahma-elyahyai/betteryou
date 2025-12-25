package ma.betteryou.betteryoubackend.entity.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

import ma.betteryou.betteryoubackend.entity.enums.ActivityLevel;
import ma.betteryou.betteryoubackend.entity.enums.FitnessLevel;
import ma.betteryou.betteryoubackend.entity.enums.Gender;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.FoodPreferences;

@Entity
@Table(name = "users") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id    //clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long idUser;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "birth_date")
    private LocalDate birthDate;

        @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private Gender gender;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "initial_weight_kg", precision = 5, scale = 2)
    private BigDecimal initialWeightKg;

    @Column(name = "target_weight_kg", precision = 5, scale = 2)
    private BigDecimal targetWeightKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal", length = 20)
    private Goal goal;

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_level", length = 20)
    private FitnessLevel fitnessLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level", length = 20)
    private ActivityLevel activityLevel;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_preferences", length = 255)
    private FoodPreferences foodPreferences;
}
