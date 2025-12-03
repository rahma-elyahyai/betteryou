package ma.betteryou.betteryoubackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private Integer age;
    private Double poids;
    private Double taille;
    private String sexe;
    private String objectif;
}
