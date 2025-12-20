package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import ma.betteryou.betteryoubackend.entity.user.User;

@Entity
@Table(name = "meal_consumption")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealConsumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")   
    private Long id;

    // USER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) 
    private User user;

    // MEAL
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Column(name = "consumption_date", nullable = false)
    private LocalDate consumptionDate;

    @Column(name = "servings", nullable = false)
    private Integer servings;
}