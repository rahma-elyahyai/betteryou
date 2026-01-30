package ma.betteryou.betteryoubackend.dto.program;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProgramCardDTO {

    private Long id;
    private String name;
    private String description;
    private String goal;
    private String status;
    private String generationType;

    private LocalDate startDate;
    private LocalDate expectedEndDate;

    private int totalSessions;
    private int completedSessions;
    private double progressPercent;
    private double totalHours;

    private LocalDate nextSessionDate;

    private List<RecentSessionDTO> recentSessions;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class RecentSessionDTO {
        private Long id;
        private LocalDate date;
        private String title;   // par ex. “Upper Body Strength”
        private String status;  // DONE / PLANNED / MISSED
    }
}
