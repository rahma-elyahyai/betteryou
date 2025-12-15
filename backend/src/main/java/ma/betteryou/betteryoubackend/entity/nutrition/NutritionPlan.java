package ma.betteryou.betteryoubackend.entity.nutrition;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import ma.betteryou.betteryoubackend.entity.user.User;

@Entity
@Table(name = "nutrition_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nutrition")
    private Long idNutrition;

    @Column(name = "nutrition_name", nullable = false, length = 100)
    private String nutritionName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "objective", length = 255)
    private String objective;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "calories_per_day")
    private Integer caloriesPerDay;

    // --------- RELATION VERS USER (1,n) ----------
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;


}
