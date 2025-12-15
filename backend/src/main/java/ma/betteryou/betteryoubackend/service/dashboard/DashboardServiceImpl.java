package ma.betteryou.betteryoubackend.service.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.betteryou.betteryoubackend.dto.dashboard.DashboardResponse;
import ma.betteryou.betteryoubackend.entity.enums.ProgramStatus;
import ma.betteryou.betteryoubackend.entity.enums.SessionStatus;
import ma.betteryou.betteryoubackend.entity.enums.SessionType;
import ma.betteryou.betteryoubackend.entity.nutrition.Contains;
import ma.betteryou.betteryoubackend.entity.nutrition.Meal;
import ma.betteryou.betteryoubackend.entity.nutrition.MealConsumption;
import ma.betteryou.betteryoubackend.entity.nutrition.NutritionPlan;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutProgram;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutSession;
import ma.betteryou.betteryoubackend.repository.MealConsumptionRepository;
import ma.betteryou.betteryoubackend.repository.NutritionPlanRepository;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.repository.WorkoutProgramRepository;
import ma.betteryou.betteryoubackend.repository.WorkoutSessionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final WorkoutProgramRepository workoutProgramRepository;
    private final WorkoutSessionRepository workoutSessionRepository;
    private final NutritionPlanRepository nutritionPlanRepository;
    private final MealConsumptionRepository mealConsumptionRepository;

    @Override
    public DashboardResponse getDashboardForUser(Integer userId) {

        // 1) USER
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id = " + userId));

        // 2) PROGRAMME ACTIF (ONGOING)
        WorkoutProgram activeProgram = workoutProgramRepository
                .findFirstByUser_IdUserAndProgramStatusOrderByStartDateDesc(
                        userId, ProgramStatus.ONGOING
                )
                .orElse(null);

        // 3) PLAN NUTRITIONNEL ACTIF
        LocalDate today = LocalDate.now();
        NutritionPlan nutritionPlan = nutritionPlanRepository
                .findFirstByUser_IdUserOrderByStartDateDesc(userId, today)
                .orElse(null);

        // ------------------------- PÉRIODE : 7 DERNIERS JOURS -------------------------
        LocalDate startOfWeek = today.minusDays(6);

        // Séances de la semaine (uniquement du programme actif)
        List<WorkoutSession> weekSessions;
        if (activeProgram != null) {
            weekSessions = workoutSessionRepository.findByProgramBetween(
                    activeProgram.getIdProgram(), startOfWeek, today
            );
        } else {
            weekSessions = List.of();
        }

        // ======================== 1) CARDS DU HAUT ========================

        // 1.1 Daily calories (objectif du plan)
        Integer dailyCalories = (nutritionPlan != null && nutritionPlan.getCaloriesPerDay() != null)
                ? nutritionPlan.getCaloriesPerDay()
                : 0;

        // 1.2 Sessions created this week (dans le programme actif)
        int sessionsPerWeek = weekSessions.size();

        // 1.3 Sessions completed this week (DONE)
        int sessionsCompleted = (int) weekSessions.stream()
                .filter(ws -> ws.getSessionStatus() == SessionStatus.DONE)
                .count();

        // 1.4 Total training minutes this week
        int totalTrainingMinutes = weekSessions.stream()
                .filter(ws -> ws.getSessionStatus() == SessionStatus.DONE)
                .filter(ws -> ws.getDurationMinutes() != null)
                .mapToInt(WorkoutSession::getDurationMinutes)
                .sum();



        // 1.5 Progression du programme
        int programProgressPercent = 0;
        String activeProgramName = null;

        if (activeProgram != null) {
            activeProgramName = activeProgram.getProgramName();

            long totalSessions =
                    workoutSessionRepository.countByWorkoutProgram_IdProgram(activeProgram.getIdProgram());

            long doneSessions =
                    workoutSessionRepository.countByWorkoutProgram_IdProgramAndSessionStatus(
                            activeProgram.getIdProgram(),
                            SessionStatus.DONE
                    );

            if (totalSessions > 0) {
                programProgressPercent = (int) Math.round((doneSessions * 100.0) / totalSessions);
            }
        }

        // ======================== 2) LINE CHART : Calories ========================
        List<DashboardResponse.DayCaloriesDto> weeklyCalories =
                buildWeeklyCalories(userId, nutritionPlan, startOfWeek, today);

        // ======================== 3) DONUT : MACROS ========================
        DashboardResponse.MacroDistributionDto macros =
                buildMacroDistribution(userId, today);

        // ======================== 4) BAR CHART : TRAINING MINUTES ========================
        List<DashboardResponse.DayTrainingDto> weeklyTraining =
                buildWeeklyTraining(userId, startOfWeek, today);

        // ======================== 5) GOAL TRACKER ========================
        DashboardResponse.GoalTrackerDto goalTracker =
                buildGoalTracker(userId);

        // ======================== 6) UPCOMING SESSIONS ========================
        List<DashboardResponse.UpcomingSessionDto> upcomingSessions =
                buildUpcomingSessions(userId, today);

        // ======================== DTO GLOBAL ========================
        return DashboardResponse.builder()
                .dailyCaloricIntake(dailyCalories)
                .targetSessionsPerWeek(sessionsPerWeek)
                .sessionsCompleted(sessionsCompleted)
                .totalTrainingMinutes(totalTrainingMinutes)
                .activeProgramName(activeProgramName)
                .programProgressPercent(programProgressPercent)
                .weeklyCalories(weeklyCalories)
                .macros(macros)
                .weeklyTraining(weeklyTraining)
                .goalTracker(goalTracker)
                .upcomingSessions(upcomingSessions)
                .build();
    }

    // =====================================================================
    // 2) CALORIES : compute meal calories (kcal/100g * grams / 100)
    // =====================================================================
    private int computeMealCalories(Meal meal) {
        if (meal == null || meal.getContains() == null) return 0;

        int total = 0;

        for (Contains c : meal.getContains()) {
            if (c == null || c.getFoodItem() == null) continue;
            if (c.getFoodItem().getCaloriesPer100g() == null) continue;
            if (c.getQuantityGrams() == null) continue;

            BigDecimal kcal = c.getFoodItem().getCaloriesPer100g()
                    .multiply(c.getQuantityGrams())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            total += kcal.intValue();
        }
        return total;
    }

    /**
     * Consumed : somme des MealConsumption par jour (meal calories * servings)
     * Burned   : somme par jour (durationMinutes * 7)
     */
    private List<DashboardResponse.DayCaloriesDto> buildWeeklyCalories(
            Integer userId,
            NutritionPlan nutritionPlan,
            LocalDate start,
            LocalDate end
    ) {
        // burned
        List<WorkoutSession> sessions =
                workoutSessionRepository.findSessionsForUserBetween(userId, start, end);

        Map<LocalDate, Integer> burnedPerDay = new HashMap<>();
        for (WorkoutSession ws : sessions) {
            if (ws.getDurationMinutes() == null || ws.getSessionDate() == null) continue;
            int burned = ws.getDurationMinutes() * 7;
            burnedPerDay.merge(ws.getSessionDate(), burned, Integer::sum);
        }

        // consumed
        List<MealConsumption> consumptions =
                mealConsumptionRepository.findByUser_IdUserAndConsumptionDateBetween(userId, start, end);

        Map<LocalDate, Integer> consumedPerDay = new HashMap<>();
        for (MealConsumption mc : consumptions) {
            if (mc.getConsumptionDate() == null) continue;

            int servings = (mc.getServings() == null || mc.getServings() <= 0) ? 1 : mc.getServings();
            int mealCalories = computeMealCalories(mc.getMeal());
            int total = mealCalories * servings;

            consumedPerDay.merge(mc.getConsumptionDate(), total, Integer::sum);
        }
        
        System.out.println("DEBUG consumedPerDay = " + consumedPerDay);
        // résultat final
        List<DashboardResponse.DayCaloriesDto> result = new ArrayList<>();
        LocalDate d = start;
        while (!d.isAfter(end)) {
            result.add(
                    DashboardResponse.DayCaloriesDto.builder()
                            .dayLabel(d.getDayOfWeek().name())
                            .consumed(consumedPerDay.getOrDefault(d, 0))
                            .burned(burnedPerDay.getOrDefault(d, 0))
                            .build()
            );
            d = d.plusDays(1);
        }

        return result;
    }

    // =====================================================================
    // 3) MACROS (placeholder)
    // =====================================================================
    private DashboardResponse.MacroDistributionDto buildMacroDistribution(
        Integer userId,
        LocalDate today
) {
    // On prend uniquement les repas consommés aujourd’hui
    List<MealConsumption> consumptions =
            mealConsumptionRepository.findByUser_IdUserAndConsumptionDateBetween(userId, today, today);

    BigDecimal totalProteins = BigDecimal.ZERO; // en grammes
    BigDecimal totalCarbs = BigDecimal.ZERO;    // en grammes
    BigDecimal totalFats = BigDecimal.ZERO;     // en grammes

    for (MealConsumption mc : consumptions) {
        if (mc == null || mc.getMeal() == null) continue;

        int servings = (mc.getServings() == null || mc.getServings() <= 0) ? 1 : mc.getServings();

        Meal meal = mc.getMeal();
        if (meal.getContains() == null) continue;

        for (Contains c : meal.getContains()) {
            if (c == null || c.getFoodItem() == null) continue;
            if (c.getQuantityGrams() == null) continue;

            BigDecimal grams = c.getQuantityGrams(); // ex: 150g

            // ⚠️ Adapte ces getters selon ton entity FoodItem
            BigDecimal p100 = c.getFoodItem().getProteinsPer100g();
            BigDecimal c100 = c.getFoodItem().getCarbsPer100g();
            BigDecimal f100 = c.getFoodItem().getFatsPer100g();

            // proteins
            if (p100 != null) {
                BigDecimal p = p100.multiply(grams)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(servings));
                totalProteins = totalProteins.add(p);
            }

            // carbs
            if (c100 != null) {
                BigDecimal carbs = c100.multiply(grams)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(servings));
                totalCarbs = totalCarbs.add(carbs);
            }

            // fats
            if (f100 != null) {
                BigDecimal fats = f100.multiply(grams)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(servings));
                totalFats = totalFats.add(fats);
            }
        }
    }

                return DashboardResponse.MacroDistributionDto.builder()
                        .totalProteins(totalProteins)
                        .totalCarbs(totalCarbs)
                        .totalFats(totalFats)
                        .build();
                }


    // =====================================================================
    // 4) TRAINING MINUTES par jour (CARDIO/STRENGTH/MIXED)
    // =====================================================================
    private List<DashboardResponse.DayTrainingDto> buildWeeklyTraining(
            Integer userId,
            LocalDate start,
            LocalDate end
    ) {
        List<WorkoutSession> sessions =
                workoutSessionRepository.findSessionsForUserBetween(userId, start, end);

        Map<LocalDate, int[]> map = new HashMap<>();

        for (WorkoutSession ws : sessions) {
        // ne compter que les séances terminées
        if (ws.getSessionStatus() != SessionStatus.DONE) continue;

        if (ws.getSessionDate() == null || ws.getDurationMinutes() == null) continue;

        int[] arr = map.computeIfAbsent(ws.getSessionDate(), d -> new int[3]);
        int duration = ws.getDurationMinutes();

        if (ws.getSessionType() == SessionType.CARDIO) arr[0] += duration;
        else if (ws.getSessionType() == SessionType.STRENGTH) arr[1] += duration;
        else if (ws.getSessionType() == SessionType.MIXED) arr[2] += duration;
        }


        List<DashboardResponse.DayTrainingDto> result = new ArrayList<>();
        LocalDate d = start;
        while (!d.isAfter(end)) {
            int[] arr = map.getOrDefault(d, new int[]{0, 0, 0});
            result.add(
                    DashboardResponse.DayTrainingDto.builder()
                            .dayLabel(d.getDayOfWeek().name())
                            .cardioMinutes(arr[0])
                            .strengthMinutes(arr[1])
                            .mixedMinutes(arr[2])
                            .build()
            );
            d = d.plusDays(1);
        }

        return result;
    }

    // =====================================================================
    // 5) GOAL TRACKER
    // =====================================================================
    private DashboardResponse.GoalTrackerDto buildGoalTracker(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow();

        WorkoutProgram program = workoutProgramRepository
                .findFirstByUser_IdUserAndProgramStatusOrderByStartDateDesc(
                        userId, ProgramStatus.ONGOING
                )
                .orElse(null);

        return DashboardResponse.GoalTrackerDto.builder()
                .objective(user.getGoal() != null ? user.getGoal().name() : null)
                .fitnessLevel(user.getFitnessLevel() != null ? user.getFitnessLevel().name() : null)
                .programStatus(program != null && program.getProgramStatus() != null
                        ? program.getProgramStatus().name()
                        : null)
                .build();
    }

    // =====================================================================
    // 6) UPCOMING SESSIONS
    // =====================================================================
    private List<DashboardResponse.UpcomingSessionDto> buildUpcomingSessions(
            Integer userId,
            LocalDate today
    ) {
        List<WorkoutSession> sessions =
                workoutSessionRepository.findUpcomingSessions(userId, today);

        List<DashboardResponse.UpcomingSessionDto> result = new ArrayList<>();
        for (WorkoutSession ws : sessions) {
            result.add(
                    DashboardResponse.UpcomingSessionDto.builder()
                            .sessionId(ws.getIdSession())
                            .sessionTitle(ws.getWorkoutProgram().getProgramName())
                            .sessionType(ws.getSessionType().name())
                            .dayLabel(ws.getSessionDate().getDayOfWeek().name())
                            .date(ws.getSessionDate().toString())
                            .durationMinutes(ws.getDurationMinutes())
                            .build()
            );
        }
        return result;
    }
}
