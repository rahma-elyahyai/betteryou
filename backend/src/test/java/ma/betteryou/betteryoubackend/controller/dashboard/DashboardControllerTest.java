package ma.betteryou.betteryoubackend.controller.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.betteryou.betteryoubackend.dto.dashboard.DashboardResponse;
import ma.betteryou.betteryoubackend.service.dashboard.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/dashboard/{userId} doit retourner un DashboardResponse 200 OK")
    void getDashboard_ShouldReturnDashboardResponse() throws Exception {
        // Given
        Long userId = 1L;
        DashboardResponse response = DashboardResponse.builder()
                .dailyCaloricIntake(2000)
                .sessionsCompleted(3)
                .targetSessionsPerWeek(5)
                .totalTrainingMinutes(120)
                .activeProgramName("Beginner Program")
                .programProgressPercent(60)
                .weeklyCalories(new ArrayList<>())
                .macros(DashboardResponse.MacroDistributionDto.builder()
                        .totalProteins(BigDecimal.valueOf(150))
                        .totalCarbs(BigDecimal.valueOf(200))
                        .totalFats(BigDecimal.valueOf(50))
                        .build())
                .weeklyTraining(new ArrayList<>())
                .goalTracker(DashboardResponse.GoalTrackerDto.builder()
                        .objective("LOSE_WEIGHT")
                        .fitnessLevel("BEGINNER")
                        .programStatus("ONGOING")
                        .build())
                .upcomingSessions(new ArrayList<>())
                .build();

        when(dashboardService.getDashboardForUser(userId)).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/dashboard/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dailyCaloricIntake").value(2000))
                .andExpect(jsonPath("$.sessionsCompleted").value(3))
                .andExpect(jsonPath("$.targetSessionsPerWeek").value(5))
                .andExpect(jsonPath("$.totalTrainingMinutes").value(120))
                .andExpect(jsonPath("$.activeProgramName").value("Beginner Program"))
                .andExpect(jsonPath("$.programProgressPercent").value(60))
                .andExpect(jsonPath("$.macros.totalProteins").value(150))
                .andExpect(jsonPath("$.macros.totalCarbs").value(200))
                .andExpect(jsonPath("$.macros.totalFats").value(50))
                .andExpect(jsonPath("$.goalTracker.objective").value("LOSE_WEIGHT"));
    }

    @Test
    @DisplayName("GET /api/dashboard/{userId} doit gérer les cas où l'utilisateur n'existe pas")
    void getDashboard_ShouldHandleUserNotFound() throws Exception {
        // Given
        Long userId = 999L;
        when(dashboardService.getDashboardForUser(userId))
                .thenThrow(new RuntimeException("User not found with id = " + userId));

        // When & Then
        mockMvc.perform(get("/api/dashboard/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @DisplayName("GET /api/dashboard/{userId} doit retourner un dashboard vide si pas de données")
    void getDashboard_ShouldReturnEmptyDashboard() throws Exception {
        // Given
        Long userId = 1L;
        DashboardResponse emptyResponse = DashboardResponse.builder()
                .dailyCaloricIntake(0)
                .sessionsCompleted(0)
                .targetSessionsPerWeek(0)
                .totalTrainingMinutes(0)
                .activeProgramName(null)
                .programProgressPercent(0)
                .weeklyCalories(new ArrayList<>())
                .macros(DashboardResponse.MacroDistributionDto.builder()
                        .totalProteins(BigDecimal.ZERO)
                        .totalCarbs(BigDecimal.ZERO)
                        .totalFats(BigDecimal.ZERO)
                        .build())
                .weeklyTraining(new ArrayList<>())
                .goalTracker(DashboardResponse.GoalTrackerDto.builder()
                        .objective(null)
                        .fitnessLevel(null)
                        .programStatus(null)
                        .build())
                .upcomingSessions(new ArrayList<>())
                .build();

        when(dashboardService.getDashboardForUser(userId)).thenReturn(emptyResponse);

        // When & Then
        mockMvc.perform(get("/api/dashboard/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dailyCaloricIntake").value(0))
                .andExpect(jsonPath("$.sessionsCompleted").value(0))
                .andExpect(jsonPath("$.activeProgramName").isEmpty());
    }
}
