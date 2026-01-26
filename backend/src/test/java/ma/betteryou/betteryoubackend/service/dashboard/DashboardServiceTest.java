package ma.betteryou.betteryoubackend.service.dashboard;

import ma.betteryou.betteryoubackend.dto.dashboard.DashboardResponse;
import ma.betteryou.betteryoubackend.entity.enums.*;
import ma.betteryou.betteryoubackend.entity.nutrition.MealConsumption;
import ma.betteryou.betteryoubackend.entity.nutrition.NutritionPlan;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutProgram;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutSession;
import ma.betteryou.betteryoubackend.repository.Nutrition.MealConsumptionRepository;
import ma.betteryou.betteryoubackend.repository.NutritionPlanRepository;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.repository.WorkoutProgramRepository;
import ma.betteryou.betteryoubackend.repository.WorkoutSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkoutProgramRepository workoutProgramRepository;

    @Mock
    private WorkoutSessionRepository workoutSessionRepository;

    @Mock
    private NutritionPlanRepository nutritionPlanRepository;

    @Mock
    private MealConsumptionRepository mealConsumptionRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    private User testUser;
    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
        testUser = User.builder()
                .idUser(userId)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .goal(Goal.LOSE_WEIGHT)
                .fitnessLevel(FitnessLevel.BEGINNER)
                .build();
    }

    @Test
    @DisplayName("getDashboardForUser doit retourner un DashboardResponse complet")
    void getDashboardForUser_ShouldReturnCompleteDashboard() {
        // Given
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(workoutProgramRepository.findFirstByUser_IdUserAndProgramStatusOrderByStartDateDesc(
                eq(userId), eq(ProgramStatus.ONGOING))).thenReturn(Optional.empty());
        when(nutritionPlanRepository.findFirstByUser_IdUserOrderByStartDateDesc(
                eq(userId), any(LocalDate.class))).thenReturn(Optional.empty());
        when(workoutSessionRepository.findSessionsForUserBetween(
                eq(userId), any(LocalDate.class), any(LocalDate.class))).thenReturn(new ArrayList<>());
        when(mealConsumptionRepository.findByUser_IdUserAndConsumptionDateBetween(
                eq(userId), any(LocalDate.class), any(LocalDate.class))).thenReturn(new ArrayList<>());
        when(workoutSessionRepository.findUpcomingSessions(eq(userId), any(LocalDate.class)))
                .thenReturn(new ArrayList<>());

        // When
        DashboardResponse response = dashboardService.getDashboardForUser(userId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getDailyCaloricIntake()).isEqualTo(0);
        assertThat(response.getSessionsCompleted()).isEqualTo(0);
        assertThat(response.getGoalTracker()).isNotNull();
    }

    @Test
    @DisplayName("getDashboardForUser doit lever une exception si l'utilisateur n'existe pas")
    void getDashboardForUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        Long nonExistentUserId = 999L;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> dashboardService.getDashboardForUser(nonExistentUserId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found with id = " + nonExistentUserId);
    }

    @Test
    @DisplayName("getDashboardForUser doit calculer correctement les calories quotidiennes depuis le plan nutritionnel")
    void getDashboardForUser_ShouldCalculateDailyCalories_FromNutritionPlan() {
        // Given
        NutritionPlan nutritionPlan = NutritionPlan.builder()
                .idNutrition(1L)
                .user(testUser)
                .caloriesPerDay(2500)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(workoutProgramRepository.findFirstByUser_IdUserAndProgramStatusOrderByStartDateDesc(
                eq(userId), eq(ProgramStatus.ONGOING))).thenReturn(Optional.empty());
        when(nutritionPlanRepository.findFirstByUser_IdUserOrderByStartDateDesc(
                eq(userId), any(LocalDate.class))).thenReturn(Optional.of(nutritionPlan));
        when(workoutSessionRepository.findSessionsForUserBetween(
                eq(userId), any(LocalDate.class), any(LocalDate.class))).thenReturn(new ArrayList<>());
        when(mealConsumptionRepository.findByUser_IdUserAndConsumptionDateBetween(
                eq(userId), any(LocalDate.class), any(LocalDate.class))).thenReturn(new ArrayList<>());
        when(workoutSessionRepository.findUpcomingSessions(eq(userId), any(LocalDate.class)))
                .thenReturn(new ArrayList<>());

        // When
        DashboardResponse response = dashboardService.getDashboardForUser(userId);

        // Then
        assertThat(response.getDailyCaloricIntake()).isEqualTo(2500);
    }

    @Test
    @DisplayName("getDashboardForUser doit calculer correctement la progression du programme")
    void getDashboardForUser_ShouldCalculateProgramProgress() {
        // Given
        WorkoutProgram activeProgram = WorkoutProgram.builder()
                .idProgram(1L)
                .user(testUser)
                .programName("Test Program")
                .programStatus(ProgramStatus.ONGOING)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(workoutProgramRepository.findFirstByUser_IdUserAndProgramStatusOrderByStartDateDesc(
                eq(userId), eq(ProgramStatus.ONGOING))).thenReturn(Optional.of(activeProgram));
        when(workoutSessionRepository.findByProgramBetween(
                eq(activeProgram.getIdProgram()), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new ArrayList<>());
        when(workoutSessionRepository.countByWorkoutProgram_IdProgram(activeProgram.getIdProgram()))
                .thenReturn(10L);
        when(workoutSessionRepository.countByWorkoutProgram_IdProgramAndSessionStatus(
                eq(activeProgram.getIdProgram()), eq(SessionStatus.DONE))).thenReturn(5L);
        when(nutritionPlanRepository.findFirstByUser_IdUserOrderByStartDateDesc(
                eq(userId), any(LocalDate.class))).thenReturn(Optional.empty());
        when(workoutSessionRepository.findSessionsForUserBetween(
                eq(userId), any(LocalDate.class), any(LocalDate.class))).thenReturn(new ArrayList<>());
        when(mealConsumptionRepository.findByUser_IdUserAndConsumptionDateBetween(
                eq(userId), any(LocalDate.class), any(LocalDate.class))).thenReturn(new ArrayList<>());
        when(workoutSessionRepository.findUpcomingSessions(eq(userId), any(LocalDate.class)))
                .thenReturn(new ArrayList<>());

        // When
        DashboardResponse response = dashboardService.getDashboardForUser(userId);

        // Then
        assertThat(response.getActiveProgramName()).isEqualTo("Test Program");
        assertThat(response.getProgramProgressPercent()).isEqualTo(50); // 5/10 = 50%
    }
}
