package ma.betteryou.betteryoubackend.service.ai;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiNutritionAiResponse {

    private String nutritionName;
    private String objective;
    private Integer caloriesPerDay;
    private String startDate;
    private String endDate;

    private List<AiDay> days;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AiDay {

        // ✅ IMPORTANT: accepte plusieurs noms possibles venant du JSON
        @JsonProperty("dayOfWeek")
        @JsonAlias({"day", "day_of_week", "weekday", "dayName"})
        private String dayOfWeek;

        private List<AiMeal> meals;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AiMeal {

        // ✅ si ton JSON utilise "slot" au lieu de "mealSlot"
        @JsonProperty("mealSlot")
        @JsonAlias({"slot", "meal_slot"})
        private String mealSlot;

        private String mealType;
        private String mealName;
        private String description;
        private String imageUrl;

        private List<String> preparationSteps;
        private List<AiItem> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AiItem {

        // ✅ si ton JSON utilise "name" au lieu de "foodName"
        @JsonProperty("foodName")
        @JsonAlias({"name", "food", "food_name"})
        private String foodName;

        // ✅ si ton JSON utilise "quantity" au lieu de "quantityGrams"
        @JsonProperty("quantityGrams")
        @JsonAlias({"quantity", "grams", "qty"})
        private Double quantityGrams;
    }
}
