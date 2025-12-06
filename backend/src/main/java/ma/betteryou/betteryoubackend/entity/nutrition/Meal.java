package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_meal")
    private Long idMeal;

    @Column(name = "meal_name", nullable = false, length = 100)
    private String mealName;

    @Column(name = "description", length = 255)
    private String description;

    // PAS d'enum ici, on reste sur String
    @Column(name = "meal_type", length = 50)
    private String mealType;

    @Column(name = "image_url", length = 255)
    private String imageUrl;
}
