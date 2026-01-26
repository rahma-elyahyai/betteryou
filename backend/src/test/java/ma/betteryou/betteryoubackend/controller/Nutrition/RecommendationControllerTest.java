package ma.betteryou.betteryoubackend.controller.Nutrition;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.dto.Nutrition.MealDetailDto;
import ma.betteryou.betteryoubackend.entity.enums.Goal;
import ma.betteryou.betteryoubackend.service.NutritionService.MealService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecommendationController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class RecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MealService mealService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/recommendations/user/{userId} doit retourner une liste de recommandations")
    void getRecommendationsByUser_ShouldReturnRecommendations() throws Exception {
        // Given
        Long userId = 1L;
        int limit = 4;
        List<MealDetailDto> recommendations = new ArrayList<>();
        MealDetailDto meal1 = new MealDetailDto();
        meal1.setMealId(1L);
        meal1.setMealName("Chicken Salad");
        recommendations.add(meal1);

        when(mealService.getRecommendationsByUser(userId, limit)).thenReturn(recommendations);

        // When & Then
        mockMvc.perform(get("/api/recommendations/user/{userId}", userId)
                        .param("limit", String.valueOf(limit))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].mealId").value(1))
                .andExpect(jsonPath("$[0].mealName").value("Chicken Salad"));
    }

    @Test
    @DisplayName("GET /api/recommendations/user/{userId} doit utiliser la limite par défaut de 4")
    void getRecommendationsByUser_ShouldUseDefaultLimit() throws Exception {
        // Given
        Long userId = 1L;
        List<MealDetailDto> recommendations = new ArrayList<>();

        when(mealService.getRecommendationsByUser(userId, 4)).thenReturn(recommendations);

        // When & Then
        mockMvc.perform(get("/api/recommendations/user/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("GET /api/recommendations/user/{userId}/meal/{mealId} doit retourner les détails d'un repas")
    void getMealDetails_ShouldReturnMealDetails() throws Exception {
        // Given
        Long userId = 1L;
        Long mealId = 1L;
        MealDetailDto meal = new MealDetailDto();
        meal.setMealId(mealId);
        meal.setMealName("Grilled Chicken");
        meal.setCalories(350);

        when(mealService.getMealById(mealId)).thenReturn(meal);

        // When & Then
        mockMvc.perform(get("/api/recommendations/user/{userId}/meal/{mealId}", userId, mealId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mealId").value(1))
                .andExpect(jsonPath("$.mealName").value("Grilled Chicken"))
                .andExpect(jsonPath("$.calories").value(350));
    }

    @Test
    @DisplayName("GET /api/recommendations/user/{userId}/meal/{mealId} doit retourner 404 si le repas n'existe pas")
    void getMealDetails_ShouldReturn404_WhenMealNotFound() throws Exception {
        // Given
        Long userId = 1L;
        Long mealId = 999L;

        when(mealService.getMealById(mealId))
                .thenThrow(new RuntimeException("Meal not found"));

        // When & Then
        mockMvc.perform(get("/api/recommendations/user/{userId}/meal/{mealId}", userId, mealId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Meal not found with id: " + mealId));
    }

    @Test
    @DisplayName("GET /api/recommendations/meals doit retourner tous les repas")
    void getAllMeals_ShouldReturnAllMeals() throws Exception {
        // Given
        List<MealDetailDto> meals = new ArrayList<>();
        MealDetailDto meal1 = new MealDetailDto();
        meal1.setMealId(1L);
        meal1.setMealName("Meal 1");
        meals.add(meal1);

        when(mealService.getAllMeals()).thenReturn(meals);

        // When & Then
        mockMvc.perform(get("/api/recommendations/meals")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].mealId").value(1));
    }

    @Test
    @DisplayName("GET /api/recommendations/mealsfiltered doit retourner les repas filtrés")
    void getAllMealsFiltered_ShouldReturnFilteredMeals() throws Exception {
        // Given
        List<MealDetailDto> meals = new ArrayList<>();
        String mealType = "BREAKFAST";
        Goal goal = Goal.LOSE_WEIGHT;

        when(mealService.getAllMeals(mealType, goal)).thenReturn(meals);

        // When & Then
        mockMvc.perform(get("/api/recommendations/mealsfiltered")
                        .param("mealType", mealType)
                        .param("goal", goal.name())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
