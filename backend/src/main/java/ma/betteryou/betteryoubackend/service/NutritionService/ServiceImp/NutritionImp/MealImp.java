package ma.betteryou.betteryoubackend.service.NutritionService.ServiceImp.NutritionImp;

import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealRepository;
import ma.betteryou.betteryoubackend.service.NutritionService.MealService;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.ArrayList;
import ma.betteryou.betteryoubackend.repository.User.UserRepository;
import ma.betteryou.betteryoubackend.dto.Nutrition.MealDetailDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.IngredientDto;

@Service
@RequiredArgsConstructor
public class MealImp implements MealService {
    private final MealRepository mealRepository;
    private final UserRepository userRepository;

    @Override
    public List<Meal> findMealByGoal(Goal goal) {
        return mealRepository.findMealByGoal(goal);
    }

    @Override
    public List<MealDetailDto> getRecommendationsByUser(Long userId, int limit) {
        // 1 recuperer l'utilisateur
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // 2 recuperer tous les repas qui ont meme goal de user
        List<Meal> meals = mealRepository.findMealByGoal(user.getGoal());
        // 3 trier les repas selon un score calcule a partir des preferences de
        // l'utilisateur
        List<ScoredMeal> scoredMeals = new ArrayList<>();
        for (Meal m : meals) {
            scoredMeals.add(new ScoredMeal(m, computeScore(m, user)));
        }
        scoredMeals.sort((a, b) -> Integer.compare(b.score, a.score));
        // 4 retourner les top N repas
        // .map(ScoredMeal :: meal) est equivalent a .map(scoredMeal -> scoredMeal.meal)
        // on veut seulement le Meal, pas le score.
        // .toList() convertit le flux en une liste.
        // 5) Prendre les "limit" premiers et les mapper en MealDto
        return scoredMeals.stream()
                .limit(limit)
                .map(scored -> {
                    Meal meal = scored.meal(); // Extraire le Meal de ScoredMeal
                    return MealDetailDto.builder()
                            .idMeal(meal.getIdMeal())
                            .mealName(meal.getMealName())
                            .description(meal.getDescription())
                            .goal(meal.getGoal())
                            .foodPreferences(meal.getFoodPreferences())
                            .mealType(meal.getMealType())
                            .imageUrl(meal.getImageUrl())
                            .calories(computeCalories(meal))
                            .proteins(computeProteins(meal))
                            .carbs(computeCarbs(meal))
                            .fats(computeFats(meal))
                            .build();
                })
                .toList();
    }

    public int computeScore(Meal m, User u) {
        int score = 0;

        if (Objects.equals(m.getFoodPreferences(), u.getFoodPreferences())) {
            score += 10;
        }
        if (Objects.equals(m.getGoal(), u.getGoal())) {
            score += 5;
        }

        return score;
    }

    private record ScoredMeal(Meal meal, int score) {
    }
    // 👉 C'est comme une mini-classe automatique
    // 👉 qui contient des champs + un constructeur + des getters
    // 👉 sans que tu écrives tout le code toi-même.

    @Override
    public MealDetailDto getMealById(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found with id: " + id));
        // on va preparer la liste(dto) des ingrediants lies a ce meal
        List<IngredientDto> ingredients = meal.getContains().stream()
                .map(contains -> new IngredientDto(
                        contains.getFoodItem().getFoodName(),
                        contains.getFoodItem().getDescription(),
                        contains.getQuantityGrams(),
                        contains.getFoodItem().getCaloriesPer100g(),
                        contains.getFoodItem().getProteinsPer100g(),
                        contains.getFoodItem().getCarbsPer100g(),
                        contains.getFoodItem().getFatsPer100g()

                ))
                .toList();

        return  MealDetailDto.builder()
                .idMeal(meal.getIdMeal())
                .mealName(meal.getMealName())
                .description(meal.getDescription())
                .goal(meal.getGoal())
                .foodPreferences(meal.getFoodPreferences())
                .mealType(meal.getMealType())
                .imageUrl(meal.getImageUrl())
                .calories(computeCalories(meal))
                .proteins(computeProteins(meal))
                .carbs(computeCarbs(meal))
                .fats(computeFats(meal))
                .ingredients(ingredients)
                .preparationSteps(meal.getPreparationSteps())
                .build();
    }

    @Override
    public BigDecimal computeCalories(Meal meal) {
        return meal.getContains().stream()
                .map(contains -> contains.getFoodItem().getCaloriesPer100g()
                        .multiply(contains.getQuantityGrams())
                        .divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal computeProteins(Meal meal) {
        return meal.getContains().stream()
                .map(contains -> contains.getFoodItem().getProteinsPer100g()
                        .multiply(contains.getQuantityGrams())
                        .divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal computeCarbs(Meal meal) {
        return meal.getContains().stream()
                .map(contains -> contains.getFoodItem().getCarbsPer100g()
                        .multiply(contains.getQuantityGrams())
                        .divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal computeFats(Meal meal) {
        return meal.getContains().stream()
                .map(contains -> contains.getFoodItem().getFatsPer100g()
                        .multiply(contains.getQuantityGrams())
                        .divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

        @Override
        public List<MealDetailDto> getAllMeals() {
            List<Meal> meals = mealRepository.findAll();
            return meals.stream()
                    .map(meal -> MealDetailDto.builder()
                            .idMeal(meal.getIdMeal())
                            .mealName(meal.getMealName())
                            .description(meal.getDescription())
                            .goal(meal.getGoal())
                            .foodPreferences(meal.getFoodPreferences())
                            .mealType(meal.getMealType())
                            .imageUrl(meal.getImageUrl())
                            .calories(computeCalories(meal))
                            .proteins(computeProteins(meal))
                            .carbs(computeCarbs(meal))
                            .fats(computeFats(meal))
                            .build())
                    .toList();
        }

        @Override
        public List<MealDetailDto> getAllMeals(String mealType, Goal goal) {
                List<Meal> meals;
                if (mealType != null && goal != null) {
                        meals = mealRepository.findByMealTypeAndGoal(mealType, Goal.valueOf(goal.name()));
                } else if (mealType != null) {
                        meals = mealRepository.findByMealType(mealType);
                } else if (goal != null) {
                        meals = mealRepository.findByGoal(Goal.valueOf(goal.name()));
                } else {
                        meals = mealRepository.findAll();
                }
        
                return meals.stream()
                        .map(meal -> MealDetailDto.builder()
                                .idMeal(meal.getIdMeal())
                                .mealName(meal.getMealName())
                                .description(meal.getDescription())
                                .goal(meal.getGoal())
                                .foodPreferences(meal.getFoodPreferences())
                                .mealType(meal.getMealType())
                                .imageUrl(meal.getImageUrl())
                                .calories(computeCalories(meal))
                                .proteins(computeProteins(meal))
                                .carbs(computeCarbs(meal))
                                .fats(computeFats(meal))
                                .build())
                        .toList();
                }

}
