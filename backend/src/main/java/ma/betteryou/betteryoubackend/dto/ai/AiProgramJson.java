// AiProgramJson.java
package ma.betteryou.betteryoubackend.dto.ai;

import java.util.List;

public record AiProgramJson(
        String programName,
        String goal,
        List<AiDay> days
) {
    public record AiDay(
            int dayIndex, // 1..7
            String title,
            List<AiSession> sessions
    ) {}

    public record AiSession(
            String sessionType,   // e.g. "STRENGTH", "CARDIO", "MOBILITY"
            String title,
            int durationMin,
            List<AiExercise> exercises
    ) {}

    public record AiExercise(
            String name,
            int sets,
            int reps,
            int restSec,
            String notes
    ) {}
}
