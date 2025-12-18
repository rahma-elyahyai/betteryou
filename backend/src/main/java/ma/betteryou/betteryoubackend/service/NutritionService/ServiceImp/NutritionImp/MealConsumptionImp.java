package ma.betteryou.betteryoubackend.service.NutritionService.ServiceImp.NutritionImp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.betteryou.betteryoubackend.dto.Nutrition.MealConsumptionDto;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.entity.nutrition.MealConsumption;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealConsumptionRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealRepository;
import ma.betteryou.betteryoubackend.repository.User.UserRepository;
import ma.betteryou.betteryoubackend.service.NutritionService.MealConsumptionService;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class MealConsumptionImp implements MealConsumptionService {

    private final MealConsumptionRepository mealConsumptionRepository;
    private final UserRepository userRepository;
    private final MealRepository mealRepository;

    @Override
    public MealConsumptionDto recordMealConsumption(Long userId, Long mealId, LocalDate consumptionDate, Integer servings) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found: " + mealId));

        MealConsumption mealConsumption = mealConsumptionRepository
                // ✅ IMPORTANT: utiliser le bon chemin vers les IDs des relations
                .findByUser_IdUserAndMeal_IdMealAndConsumptionDate(userId, mealId, consumptionDate)
                .orElseGet(() -> MealConsumption.builder()
                        .user(user)
                        .meal(meal)
                        .consumptionDate(consumptionDate)
                        .servings(0)
                        .build());

        // ✅ éviter NPE si servings est null
        int add = (servings == null ? 0 : servings);
        mealConsumption.setServings(mealConsumption.getServings() + add);

        MealConsumption saved = mealConsumptionRepository.save(mealConsumption);

        return MealConsumptionDto.builder()
                .userId(saved.getUser().getIdUser())
                .mealId(saved.getMeal().getIdMeal())
                .consumptionDate(saved.getConsumptionDate())
                .servings(saved.getServings())
                .build();
    }
}
