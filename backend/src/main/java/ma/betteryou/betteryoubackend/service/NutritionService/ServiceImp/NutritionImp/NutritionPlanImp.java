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
import java.util.Collections;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    long startTime = System.currentTimeMillis();
    
      // ✅ ÉTAPE 1 : Charger les plans avec leurs meals (sans détails)
    List<NutritionPlan> nutritionPlans = nutritionPlanRepository.findByUserIdWithMeals(idUser);
    
    if (nutritionPlans.isEmpty()) {
        return Collections.emptyList();
    }

    // ✅ ÉTAPE 2 : Collecter tous les IDs des meals
    Set<Long> allMealIds = nutritionPlans.stream()
        .flatMap(plan -> plan.getComposedOf().stream())
        .map(co -> co.getMeal().getIdMeal())
        .collect(Collectors.toSet());
    
    // ✅ ÉTAPE 3 : Charger les détails de TOUS les meals en UNE SEULE requête
    if (!allMealIds.isEmpty()) {
        mealRepository.findByIdInWithIngredients(new ArrayList<>(allMealIds));
        // Hibernate met en cache automatiquement ces résultats
    }
     long queryTime = System.currentTimeMillis() - startTime;
        System.out.println("🚀 Loaded " + nutritionPlans.size() + " plans with " + allMealIds.size() + " meals in " + queryTime + "ms");
        
   

    // ✅ Convertir chaque NutritionPlan en DTO
    List<NutritionPlanDto> result = nutritionPlans.stream()
            .map(plan -> convertToNutritionPlanDto(plan, dayOfWeek))
            .collect(Collectors.toList());
    
    long totalTime = System.currentTimeMillis() - startTime;
    System.out.println("✅ Total processing time: " + totalTime + "ms");
    
    return result;
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
    User user = userRepository.findById(nutritionPlanDto.getIdUser())
        .orElseThrow(() -> new RuntimeException("User not found"));

    LocalDate startDate = LocalDate.parse(nutritionPlanDto.getStartDate());
    LocalDate endDate = startDate.plusDays(6);

    // 🔥 SIMPLE : Trouver et terminer l'ancien plan automatiquement
    List<NutritionPlan> activePlans = nutritionPlanRepository.findByUser_IdUser(user.getIdUser())
        .stream()
        .filter(plan ->!plan.getEndDate().isBefore(LocalDate.now()))
        .collect(Collectors.toList());
    
    // Si un plan est encore actif, on le termine (endDate = hier)
    for (NutritionPlan oldPlan : activePlans) {
        oldPlan.setEndDate(LocalDate.now().minusDays(1)); // Termine hier
        nutritionPlanRepository.save(oldPlan);
        System.out.println("⚠️ Auto-terminated old plan: " + oldPlan.getIdNutrition());
    }
    // 🔥 FIN

    // Créer le nouveau plan 
    NutritionPlan nutritionPlan = NutritionPlan.builder()
        .nutritionName(nutritionPlanDto.getNutritionName())
        .startDate(startDate)
        .endDate(endDate)
        .objective(nutritionPlanDto.getObjective())
        .description(nutritionPlanDto.getDescription())
        .caloriesPerDay(nutritionPlanDto.getCaloriesPerDay())
        .user(user)
        .build();

    NutritionPlan savedPlan = nutritionPlanRepository.save(nutritionPlan);

    return NutritionPlanDto.builder()
        .idNutrition(savedPlan.getIdNutrition())
        .nutritionName(savedPlan.getNutritionName())
        .startDate(savedPlan.getStartDate().toString())
        .endDate(savedPlan.getEndDate().toString())
        .objective(savedPlan.getObjective())
        .description(savedPlan.getDescription())
        .caloriesPerDay(savedPlan.getCaloriesPerDay())
        .idUser(user.getIdUser())
        .build();
}

    @Override
public NutritionPlanDto addMealToNutritionPlan(Long idNutritionPlan, Long idMeal, String dayOfWeek, String mealSlot) {
    // ✅ CHANGEMENT : Charger avec les détails optimisés
    NutritionPlan plan = nutritionPlanRepository.findByIdWithMeals(idNutritionPlan)
            .orElseThrow(() -> new RuntimeException("Nutrition plan not found with id: " + idNutritionPlan));
    
    checkPlanIsActive(plan);
    
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

    // ✅ Charger les détails de tous les meals pour la conversion en DTO
    Set<Long> mealIds = plan.getComposedOf().stream()
        .map(co -> co.getMeal().getIdMeal())
        .collect(Collectors.toSet());
    
    if (!mealIds.isEmpty()) {
        mealRepository.findByIdInWithIngredients(new ArrayList<>(mealIds));
    }

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
        NutritionPlan plan = nutritionPlanRepository.findByIdWithMeals(idNutrition)
            .orElseThrow(() -> new RuntimeException("Nutrition plan not found with id: " + idNutrition));
    checkPlanIsActive(plan);
    composedOfRepository.deleteMealFromPlan(idNutrition, idMeal, dayOfWeek, mealSlot);
    
    System.out.println("=== APRÈS SUPPRESSION ===");
    System.out.println("Meal deleted from nutrition plan");
}

    @Override
    public void updateNutritionPlan(Long idNutrition, NutritionPlanDto nutritionPlanDto){
        NutritionPlan plan = nutritionPlanRepository.findById(idNutrition)
            .orElseThrow(() -> new RuntimeException("Plan not found"));

        LocalDate newStartDate = LocalDate.parse(nutritionPlanDto.getStartDate());
        LocalDate newEndDate = newStartDate.plusDays(6); // ✅ Toujours 7 jours
        LocalDate today = LocalDate.now();
    
        if (plan.getEndDate() != null && plan.getEndDate().isBefore(today)) {
            throw new RuntimeException("Cannot update a completed nutrition plan");
        }
        //  Modifie l'entité existante (builder crée une nouvelle)
        plan.setNutritionName(nutritionPlanDto.getNutritionName());
        plan.setObjective(nutritionPlanDto.getObjective());
        plan.setDescription(nutritionPlanDto.getDescription());
        plan.setCaloriesPerDay(nutritionPlanDto.getCaloriesPerDay());
        plan.setStartDate(newStartDate);
        plan.setEndDate(newEndDate);

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
    
    NutritionPlan plan = nutritionPlanRepository.findByIdWithMeals(idNutritionPlan)
            .orElseThrow(() -> new RuntimeException("Nutrition plan not found with id: " + idNutritionPlan));

    checkPlanIsActive(plan);
    
    Meal newMeal = mealRepository.findById(newMealId)
            .orElseThrow(() -> new RuntimeException("Meal not found with id: " + newMealId));

    // ✅ Trouver le ComposedOf existant
    Optional<ComposedOf> existingComposedOfOpt = composedOfRepository.findByNutritionPlanIdAndMealIdAndDayOfWeekAndMealSlot(
        idNutritionPlan, oldMealId, dayOfWeek, mealSlot.toUpperCase()
    );

    if (existingComposedOfOpt.isPresent()) {
        ComposedOf existingComposedOf = existingComposedOfOpt.get();
        
        // ⭐ ÉTAPE 1 : Retirer l'ancien de la collection EN PREMIER
        plan.getComposedOf().remove(existingComposedOf);
        
        // ⭐ ÉTAPE 2 : Supprimer de la BDD
        composedOfRepository.delete(existingComposedOf);
        
        // ⭐ ÉTAPE 3 : Créer et ajouter le nouveau
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

        // ⭐ ÉTAPE 4 : Sauvegarder
        nutritionPlanRepository.save(plan);
    } else {
        throw new RuntimeException(String.format("No existing meal found: planId=%d, oldMealId=%d, day=%s, slot=%s", 
            idNutritionPlan, oldMealId, dayOfWeek, mealSlot));
    }

    // ✅ Charger les détails pour la conversion en DTO
    Set<Long> mealIds = plan.getComposedOf().stream()
        .map(co -> co.getMeal().getIdMeal())
        .collect(Collectors.toSet());
    
    if (!mealIds.isEmpty()) {
        mealRepository.findByIdInWithIngredients(new ArrayList<>(mealIds));
    }
    
    return convertToNutritionPlanDto(plan, dayOfWeek);
}



    private void checkPlanIsActive(NutritionPlan plan) {
    if (plan == null) {
        throw new RuntimeException("Nutrition plan not found");
    }
    
    LocalDate today = LocalDate.now();
    
    // Plan terminé ?
    if (plan.getEndDate() != null && plan.getEndDate().isBefore(today)) {
        throw new RuntimeException(
            String.format(
                "Nutrition plan '%s' (ID: %d) ended on %s. " +
                "You cannot modify a completed plan.",
                plan.getNutritionName(),
                plan.getIdNutrition(),
                plan.getEndDate()
            )
        );
    }}


    @Override
    @Transactional
    public void endNutritionPlan(Long idNutrition) {
        NutritionPlan plan = nutritionPlanRepository.findById(idNutrition)
            .orElseThrow(() -> new RuntimeException("Nutrition plan not found"));
        
        LocalDate today = LocalDate.now();
        
        // Ne peut pas terminer un plan déjà terminé
        if (plan.getEndDate().isBefore(today)) {
            throw new RuntimeException("Nutrition plan already ended on " + plan.getEndDate());
        }
        
        // Ne peut pas terminer un plan pas encore commencé
        if (plan.getStartDate().isAfter(today)) {
            throw new RuntimeException("Cannot end a plan that hasn't started yet");
        }
        
        // Termine le plan (hier pour être sûr)
        plan.setEndDate(today.minusDays(1));
        nutritionPlanRepository.save(plan);
        
        System.out.println("✅ Plan " + idNutrition + " ended on " + plan.getEndDate());
    }
}