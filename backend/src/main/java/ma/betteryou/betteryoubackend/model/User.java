package ma.betteryou.betteryoubackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Integer id;

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

    @Column(name = "gender")
    private String gender;        // 'MALE' / 'FEMALE'

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "initial_weight_kg", precision = 5, scale = 2)
    private BigDecimal initialWeightKg;

    @Column(name = "target_weight_kg", precision = 5, scale = 2)
    private BigDecimal targetWeightKg;

    // colonne goal dans la DB (LOSE_WEIGHT / MAINTAIN / GAIN_MASS)
    // ⚠️ si dans ta DB le nom est "qoal" (typo), change simplement name="qoal"
    @Column(name = "goal")
    private String goal;
}
