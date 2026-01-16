package ma.betteryou.betteryoubackend.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardResponse {

    // ===================== 1) CARD DU HAUT =====================

    /** Carte 1 : Daily Caloric Intake */
    private Integer dailyCaloricIntake;        // kcal consomme par jour (plan nutrition)

    /** Carte 2 : Sessions completed (sur la semaine) */
    private Integer sessionsCompleted;         // nb de séances DONE cette semaine
    private Integer targetSessionsPerWeek;     // objectif de séances / semaine

    /** Carte 3 : Total time training (semaine) */
    private Integer totalTrainingMinutes;      // minutes d'entraînement cette semaine

    /** Carte 4 : Active program + jauge */
    private String activeProgramName;          // nom du programme en cours
    private Integer programProgressPercent;    // % de progression du programme

    // ===================== 2) GRAPHIQUE : Calories =====================

    /**
     * Ligne "Calories Consumed vs Burned this Week"
     * Un élément par jour (Monday, Tuesday, …).
     */
    private List<DayCaloriesDto> weeklyCalories;

    // ===================== 3) DONUT : Macros =====================

    /**
     * Répartition des macros (pour la donut "Macronutrient Distribution").
     */
    private MacroDistributionDto macros;

    // ===================== 4) BAR CHART : Training minutes =====================

    /**
     * "Training minutes completed each day"
     * Pour chaque jour : minutes de CARDIO / STRENGTH / MIXED.
     */
    private List<DayTrainingDto> weeklyTraining;

    // ===================== 5) GOAL TRACKER =====================

    /**
     * Bloc "Goal tracker" à droite.
     */
    private GoalTrackerDto goalTracker;

    // ===================== 6) UPCOMING SESSIONS =====================

    /**
     * Liste des cartes "Upcoming Sessions" en bas.
     */
    private List<UpcomingSessionDto> upcomingSessions;

    // ========== Sous-DTOs ==========

    @Data
    @Builder
    public static class DayCaloriesDto {
        private String dayLabel;   // ex: "MONDAY"
        private Integer consumed;  // kcal consommées
        private Integer burned;    // kcal brûlées
    }

    @Data
    @Builder
    public static class MacroDistributionDto {
        private BigDecimal totalProteins;
        private BigDecimal totalCarbs;
        private BigDecimal totalFats;
    }

    @Data
    @Builder
    public static class DayTrainingDto {
        private String dayLabel;        // "MONDAY", etc.
        private Integer cardioMinutes;  // durée totale CARDIO
        private Integer strengthMinutes;// durée totale STRENGTH
        private Integer mixedMinutes;   // durée totale MIXED
    }

    @Data
    @Builder
    public static class GoalTrackerDto {
        private String objective;     // objectif (LOSE_WEIGHT, etc.)
        private String fitnessLevel;  // BEGINNER / INTERMEDIATE / ADVANCED
        private String programStatus; // ONGOING / COMPLETED / CANCELLED
    }

    @Data
    @Builder
    public static class UpcomingSessionDto {
        private Long sessionId;
        private String sessionTitle;     // ex: "Upper Body"
        private String sessionType;      // CARDIO / STRENGTH / MIXED
        private String dayLabel;         // "MONDAY", …
        private String date;             // "2025-12-11"
        private Integer durationMinutes; // 60 min
    }
}
