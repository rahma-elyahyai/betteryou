package ma.betteryou.betteryoubackend.repository.Nutrition;

public interface MealRepositoryCustom {
    Long insertMealReturningId(
            String description,
            String foodPreferences,
            String goal,
            String imageUrl,
            String mealName,
            String mealStatus,
            String mealType,
            String prepStepsJson
    );
}
