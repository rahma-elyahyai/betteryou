package ma.betteryou.betteryoubackend.service.NutritionService.ServiceImp.NutritionImp;

import ma.betteryou.betteryoubackend.repository.Nutrition.ComposedOfRepository;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealRepository;
import ma.betteryou.betteryoubackend.repository.NutritionPlanRepository;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.NutritionService.NutritionPlanService;
import ma.betteryou.betteryoubackend.dto.Nutrition.NutritionPlanDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.MealDetailDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.IngredientDto;
import ma.betteryou.betteryoubackend.entity.nutrition.NutritionPlan;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOf;
import ma.betteryou.betteryoubackend.entity.nutrition.ComposedOfId;
import ma.betteryou.betteryoubackend.entity.nutrition.Contains;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class NutritionPlanImp implements NutritionPlanService {

    private final NutritionPlanRepository nutritionPlanRepository;
    private final MealImp mealImp;
    private final MealRepository mealRepository;
    private final ComposedOfRepository composedOfRepository;
        private final UserRepository userRepository; 

    @Override
    public List<NutritionPlanDto> getNutritionPlanByUserId(Long idUser, String dayOfWeek) {
        
        // ✅ Récupère une liste
        List<NutritionPlan> nutritionPlans = nutritionPlanRepository.findByUser_IdUser(idUser);
        
        if (nutritionPlans.isEmpty()) {
            return plans == null ? List.of() : plans;

        }

        // ✅ Convertir chaque NutritionPlan en DTO
        return nutritionPlans.stream()
                .map(plan -> convertToNutritionPlanDto(plan, dayOfWeek))
                .collect(Collectors.toList());
    }

    // ✅ Méthode pour convertir NutritionPlan -> NutritionPlanDto
    private NutritionPlanDto convertToNutritionPlanDto(NutritionPlan nutritionPlan, String dayOfWeek) {
        List<MealDetailDto> meals = nutritionPlan.getComposedOf()
                .stream()
                .filter(composedOf -> composedOf.getId().getDayOfWeek().equalsIgnoreCase(dayOfWeek))
                .sorted((a,b) -> slotOrder(a.getMealSlot()) - slotOrder(b.getMealSlot()))
                .map(this::convertToMealDetailDto)
                .collect(Collectors.toList());

        return NutritionPlanDto.builder()
                .idNutrition(nutritionPlan.getIdNutrition())
                .nutritionName(nutritionPlan.getNutritionName())
                .startDate(nutritionPlan.getStartDate().toString())
                .endDate(nutritionPlan.getEndDate().toString())
                .objective(nutritionPlan.getObjective())
                .description(nutritionPlan.getDescription())
                .caloriesPerDay(nutritionPlan.getCaloriesPerDay())
                .meals(meals)
                .build();
    }

    // ✅ Méthode pour convertir ComposedOf -> MealDetailDto
    private MealDetailDto convertToMealDetailDto(ComposedOf composedOf) {
        Meal meal = composedOf.getMeal();
        
        List<IngredientDto> ingredients = meal.getContains()
                .stream()
                .map(this::convertToIngredientDto)
                .collect(Collectors.toList());

        return MealDetailDto.builder()
            .idMeal(meal.getIdMeal())
            .mealName(meal.getMealName())
            .description(meal.getDescription())
            .goal(meal.getGoal())
            .foodPreferences(meal.getFoodPreferences())
            .mealType(meal.getMealType())
            .imageUrl(meal.getImageUrl())
            .ingredients(ingredients)
            .calories(mealImp.computeCalories(meal))
            .proteins(mealImp.computeProteins(meal))
            .carbs(mealImp.computeCarbs(meal))
            .fats(mealImp.computeFats(meal))
            .preparationSteps(meal.getPreparationSteps())
            .mealSlot(composedOf.getMealSlot())
            .build();
    }

    // ✅ Méthode pour convertir Contains -> IngredientDto
    private IngredientDto convertToIngredientDto(Contains contains) {
        return new IngredientDto(
            contains.getFoodItem().getFoodName(),
            contains.getFoodItem().getDescription(),
            contains.getQuantityGrams(),
            contains.getFoodItem().getCaloriesPer100g(),
            contains.getFoodItem().getProteinsPer100g(),
            contains.getFoodItem().getCarbsPer100g(),
            contains.getFoodItem().getFatsPer100g()
        );
    }

    // ✅ Méthode pour ordonner les slots de repas
    private int slotOrder(String slot) {
        switch (slot.toLowerCase()) {
            case "breakfast":
                return 1;
            case "lunch":
                return 2;
            case "dinner":
                return 3;
            case "snack":
                return 4;
            default:
                return 999; // pour les slots inconnus
        }
    }


@Override
public NutritionPlanDto saveNutritionPlanDto(NutritionPlanDto nutritionPlanDto) {

    System.out.println("DTO userId = " + nutritionPlanDto.getIdUser());

    User user = userRepository.findById(nutritionPlanDto.getIdUser())
        .orElseThrow(() -> new RuntimeException("User not found: " + nutritionPlanDto.getIdUser()));

    NutritionPlan nutritionPlan = NutritionPlan.builder()
        .nutritionName(nutritionPlanDto.getNutritionName())
        .startDate(LocalDate.parse(nutritionPlanDto.getStartDate()))
        .endDate(LocalDate.parse(nutritionPlanDto.getStartDate()).plusDays(6)) // ✅ Fixe la durée à 7 jours
        .objective(nutritionPlanDto.getObjective())
        .description(nutritionPlanDto.getDescription())
        .caloriesPerDay(nutritionPlanDto.getCaloriesPerDay())
        .user(user) // ✅ IMPORTANT -> va remplir id_user
        .build();

    NutritionPlan savedPlan = nutritionPlanRepository.save(nutritionPlan);

    return NutritionPlanDto.builder()
        .idNutrition(savedPlan.getIdNutrition())
        .nutritionName(savedPlan.getNutritionName())
        .startDate(savedPlan.getStartDate().toString())
        .endDate(savedPlan.getStartDate().plusDays(6).toString())
        .objective(savedPlan.getObjective())
        .description(savedPlan.getDescription())
        .caloriesPerDay(savedPlan.getCaloriesPerDay())
        .idUser(user.getIdUser())
        .build();
}

    @Override
    public NutritionPlanDto addMealToNutritionPlan(Long idNutritionPlan, Long idMeal, String dayOfWeek, String mealSlot) {
    NutritionPlan plan = nutritionPlanRepository.findById(idNutritionPlan)
            .orElseThrow(() -> new RuntimeException("Nutrition plan not found with id: " + idNutritionPlan));

    Meal meal = mealRepository.findById(idMeal)
            .orElseThrow(() -> new RuntimeException("Meal not found with id: " + idMeal));

    ComposedOf composedOf = new ComposedOf();

    ComposedOfId id = new ComposedOfId();
    id.setIdNutrition(idNutritionPlan);
    id.setIdMeal(idMeal);
    id.setDayOfWeek(dayOfWeek);

    composedOf.setId(id);
    composedOf.setNutritionPlan(plan);
    composedOf.setMeal(meal);
    composedOf.setMealSlot(mealSlot);

    plan.getComposedOf().add(composedOf);

    nutritionPlanRepository.save(plan);

    return convertToNutritionPlanDto(plan, dayOfWeek);
}



@Override
@Transactional
public void removeMealFromPlan(Long idNutrition, Long idMeal, String dayOfWeek, String mealSlot) {
    System.out.println("=== AVANT SUPPRESSION ===");
    System.out.println("idNutrition: " + idNutrition);
    System.out.println("idMeal: " + idMeal);
    System.out.println("dayOfWeek: " + dayOfWeek);
    System.out.println("mealSlot: " + mealSlot);
    
    composedOfRepository.deleteMealFromPlan(idNutrition, idMeal, dayOfWeek, mealSlot);
    
    System.out.println("=== APRÈS SUPPRESSION ===");
    System.out.println("Meal deleted from nutrition plan");
}

    @Override
    public void updateNutritionPlan(Long idNutrition, NutritionPlanDto nutritionPlanDto){
        NutritionPlan plan = nutritionPlanRepository.findById(idNutrition)
            .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        //  Modifie l'entité existante (builder crée une nouvelle)
        plan.setNutritionName(nutritionPlanDto.getNutritionName());
        plan.setObjective(nutritionPlanDto.getObjective());
        plan.setDescription(nutritionPlanDto.getDescription());
        plan.setCaloriesPerDay(nutritionPlanDto.getCaloriesPerDay());
        plan.setStartDate(LocalDate.parse(nutritionPlanDto.getStartDate()));
        plan.setEndDate(LocalDate.parse(nutritionPlanDto.getEndDate()));
        
        //  Sauvegarde l'entité modifiée
        nutritionPlanRepository.save(plan);
    }

    @Override
    public void deletePlan(Long idNutrition){
        NutritionPlan plan = nutritionPlanRepository.findById(idNutrition).orElseThrow(() -> new RuntimeException("Plan not found with id " + idNutrition));
        nutritionPlanRepository.deleteById(plan.getIdNutrition());
        System.out.println("deleted : " + idNutrition);
    }



    @Override
    public NutritionPlanDto replaceMealInPlan(Long idNutritionPlan, Long oldMealId, Long newMealId, String dayOfWeek, String mealSlot) {
        System.out.println("Replacing meal in plan: " + idNutritionPlan + ", oldMealId: " + oldMealId + ", newMealId: " + newMealId + ", dayOfWeek: " + dayOfWeek + ", mealSlot: " + mealSlot);
        NutritionPlan plan = nutritionPlanRepository.findById(idNutritionPlan)
                .orElseThrow(() -> new RuntimeException("Nutrition plan not found with id: " + idNutritionPlan));

        Meal newMeal = mealRepository.findById(newMealId)
                .orElseThrow(() -> new RuntimeException("Meal not found with id: " + newMealId));

        // Trouver le ComposedOf existant à remplacer
        Optional<ComposedOf> existingComposedOfOpt = composedOfRepository.findByNutritionPlanIdAndMealIdAndDayOfWeekAndMealSlot(
            idNutritionPlan, oldMealId, dayOfWeek, mealSlot.toUpperCase()
        );

        if (existingComposedOfOpt.isPresent()) {
            ComposedOf existingComposedOf = existingComposedOfOpt.get();
            composedOfRepository.delete(existingComposedOf); // Supprimer l'ancien lien car sans ça ça crée un conflit de clé primaire (unique)
        
            ComposedOf newComposedOf = new ComposedOf();
            ComposedOfId id = new ComposedOfId();
            id.setIdNutrition(idNutritionPlan);
            id.setIdMeal(newMealId);
            id.setDayOfWeek(dayOfWeek);

            newComposedOf.setId(id);
            newComposedOf.setNutritionPlan(plan);
            newComposedOf.setMeal(newMeal);
            newComposedOf.setMealSlot(mealSlot);

            plan.getComposedOf().add(newComposedOf);
        

        nutritionPlanRepository.save(plan);
        } else {
            throw new RuntimeException( String.format("No existing meal found: planId=%d, oldMealId=%d, day=%s, slot=%s", 
                idNutritionPlan, oldMealId, dayOfWeek, mealSlot));
        }
        return convertToNutritionPlanDto(plan, dayOfWeek);
    }
}