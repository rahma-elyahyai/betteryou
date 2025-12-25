package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.entity.enums.FoodPreferences;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import ma.betteryou.betteryoubackend.entity.enums.SessionStatus;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "goal", length = 20)
    private Goal goal;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_preferences", length = 50)
    private FoodPreferences foodPreferences;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_status", length = 20)  
    private SessionStatus mealStatus;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference  
    private List<Contains> contains;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preparation_steps", columnDefinition = "jsonb")
    private String preparationSteps;
}
