package ma.betteryou.betteryoubackend.controller.Nutrition;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.dto.Nutrition.AddMealDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.MealConsumptionDto;
import ma.betteryou.betteryoubackend.dto.Nutrition.NutritionPlanDto;
import ma.betteryou.betteryoubackend.service.NutritionService.MealConsumptionService;
import ma.betteryou.betteryoubackend.service.NutritionService.NutritionPlanService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MyPrograms.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class MyProgramsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NutritionPlanService nutritionPlanService;

    @MockBean
    private MealConsumptionService mealConsumptionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/myprograms/user/{idUser} doit retourner les plans nutritionnels")
    void getNutritionPlanByUserId_ShouldReturnNutritionPlans() throws Exception {
        // Given
        Long userId = 1L;
        String dayOfWeek = "Monday";
        List<NutritionPlanDto> plans = new ArrayList<>();
        NutritionPlanDto plan = new NutritionPlanDto();
        plan.setIdNutrition(1L);
        plan.setPlanName("Test Plan");
        plans.add(plan);

        when(nutritionPlanService.getNutritionPlanByUserId(userId, dayOfWeek)).thenReturn(plans);

        // When & Then
        mockMvc.perform(get("/api/myprograms/user/{idUser}", userId)
                        .param("dayOfWeek", dayOfWeek)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].idNutrition").value(1))
                .andExpect(jsonPath("$[0].planName").value("Test Plan"));
    }

    @Test
    @DisplayName("POST /api/myprograms/recordMealConsumption doit enregistrer une consommation de repas")
    void recordMealConsumption_ShouldRecordConsumption() throws Exception {
        // Given
        MealConsumptionDto requestDto = new MealConsumptionDto();
        requestDto.setUserId(1);
        requestDto.setMealId(1L);
        requestDto.setConsumptionDate(LocalDate.now());
        requestDto.setServings(2);

        MealConsumptionDto responseDto = new MealConsumptionDto();
        responseDto.setUserId(1);
        responseDto.setMealId(1L);

        when(mealConsumptionService.recordMealConsumption(
                eq(1L), eq(1L), any(LocalDate.class), eq(2)))
                .thenReturn(responseDto);

        // When & Then
        mockMvc.perform(post("/api/myprograms/recordMealConsumption")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.mealId").value(1));
    }

    @Test
    @DisplayName("POST /api/myprograms/saveNutritionPlan doit sauvegarder un plan nutritionnel")
    void saveNutritionPlan_ShouldSavePlan() throws Exception {
        // Given
        NutritionPlanDto requestDto = new NutritionPlanDto();
        requestDto.setPlanName("New Plan");
        requestDto.setUserId(1L);

        NutritionPlanDto responseDto = new NutritionPlanDto();
        responseDto.setIdNutrition(1L);
        responseDto.setPlanName("New Plan");

        when(nutritionPlanService.saveNutritionPlanDto(any(NutritionPlanDto.class)))
                .thenReturn(responseDto);

        // When & Then
        mockMvc.perform(post("/api/myprograms/saveNutritionPlan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idNutrition").value(1))
                .andExpect(jsonPath("$.planName").value("New Plan"));
    }

    @Test
    @DisplayName("POST /api/myprograms/nutritionplans/{idNutrition}/addMeal/{idMeal} doit ajouter un repas au plan")
    void addMealToNutritionPlan_ShouldAddMeal() throws Exception {
        // Given
        Long planId = 1L;
        Long mealId = 1L;
        AddMealDto requestDto = new AddMealDto();
        requestDto.setDayOfWeek("Monday");
        requestDto.setMealSlot("BREAKFAST");

        NutritionPlanDto responseDto = new NutritionPlanDto();
        responseDto.setIdNutrition(planId);

        when(nutritionPlanService.addMealToNutritionPlan(
                eq(planId), eq(mealId), eq("Monday"), eq("BREAKFAST")))
                .thenReturn(responseDto);

        // When & Then
        mockMvc.perform(post("/api/myprograms/nutritionplans/{idNutrition}/addMeal/{idMeal}",
                        planId, mealId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idNutrition").value(1));
    }

    @Test
    @DisplayName("DELETE /api/myprograms/nutritionplans/{idNutrition}/removeMeal doit retirer un repas du plan")
    void removeMealFromPlan_ShouldRemoveMeal() throws Exception {
        // Given
        Long planId = 1L;
        Long mealId = 1L;
        String dayOfWeek = "Monday";
        String mealSlot = "BREAKFAST";

        doNothing().when(nutritionPlanService).removeMealFromPlan(
                eq(planId), eq(mealId), eq(dayOfWeek), eq(mealSlot));

        // When & Then
        mockMvc.perform(delete("/api/myprograms/nutritionplans/{idNutrition}/removeMeal", planId)
                        .param("idMeal", String.valueOf(mealId))
                        .param("dayOfWeek", dayOfWeek)
                        .param("mealSlot", mealSlot)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(nutritionPlanService).removeMealFromPlan(planId, mealId, dayOfWeek, mealSlot);
    }

    @Test
    @DisplayName("PUT /api/myprograms/nutritionplans/{idNutrition}/update doit mettre à jour un plan")
    void updateNutritionPlan_ShouldUpdatePlan() throws Exception {
        // Given
        Long planId = 1L;
        NutritionPlanDto requestDto = new NutritionPlanDto();
        requestDto.setPlanName("Updated Plan");

        doNothing().when(nutritionPlanService).updateNutritionPlan(
                eq(planId), any(NutritionPlanDto.class));

        // When & Then
        mockMvc.perform(put("/api/myprograms/nutritionplans/{idNutrition}/update", planId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        verify(nutritionPlanService).updateNutritionPlan(eq(planId), any(NutritionPlanDto.class));
    }

    @Test
    @DisplayName("DELETE /api/myprograms/nutritionplans/{idNutrition}/delete doit supprimer un plan")
    void deletePlan_ShouldDeletePlan() throws Exception {
        // Given
        Long planId = 1L;

        doNothing().when(nutritionPlanService).deletePlan(planId);

        // When & Then
        mockMvc.perform(delete("/api/myprograms/nutritionplans/{idNutrition}/delete", planId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(nutritionPlanService).deletePlan(planId);
    }

    @Test
    @DisplayName("PUT /api/myprograms/nutritionplans/{idNutrition}/replaceMeal doit remplacer un repas")
    void replaceMealInPlan_ShouldReplaceMeal() throws Exception {
        // Given
        Long planId = 1L;
        Long oldMealId = 1L;
        Long newMealId = 2L;
        String dayOfWeek = "Monday";
        String mealSlot = "BREAKFAST";

        NutritionPlanDto responseDto = new NutritionPlanDto();
        responseDto.setIdNutrition(planId);

        when(nutritionPlanService.replaceMealInPlan(
                eq(planId), eq(oldMealId), eq(newMealId), eq(dayOfWeek), eq(mealSlot)))
                .thenReturn(responseDto);

        // When & Then
        mockMvc.perform(put("/api/myprograms/nutritionplans/{idNutrition}/replaceMeal", planId)
                        .param("oldMealId", String.valueOf(oldMealId))
                        .param("newMealId", String.valueOf(newMealId))
                        .param("dayOfWeek", dayOfWeek)
                        .param("mealSlot", mealSlot)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idNutrition").value(1));
    }
}
