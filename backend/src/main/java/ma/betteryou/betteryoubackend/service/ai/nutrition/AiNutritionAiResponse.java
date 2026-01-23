package ma.betteryou.betteryoubackend.service.ai.nutrition;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiNutritionAiResponse {

    private String nutritionName;
    private String objective;
    private Integer caloriesPerDay;
    private String startDate;
    private String endDate;
    private List<AiDay> days;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AiDay {
        @JsonProperty("dayOfWeek")
        @JsonAlias({"day", "day_of_week", "weekday"})
        private String dayOfWeek;

        private List<AiMeal> meals;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AiMeal {
        @JsonProperty("mealSlot")
        @JsonAlias({"slot", "meal_slot"})
        private String mealSlot;

        private String mealName;
        private String description;

        private List<String> preparationSteps;

        private List<AiItem> items;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AiItem {
        @JsonProperty("foodName")
        @JsonAlias({"name", "food", "food_name"})
        private String foodName;

        @JsonProperty("quantityGrams")
        @JsonAlias({"quantity", "grams", "qty"})
        private Double quantityGrams;
    }
}
