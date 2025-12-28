package ma.betteryou.betteryoubackend.service.program;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.program.ProgramCardDTO;
import ma.betteryou.betteryoubackend.model.WorkoutProgram;
import ma.betteryou.betteryoubackend.model.WorkoutSession;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutProgramRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final WorkoutProgramRepository programRepository;

    public List<ProgramCardDTO> getProgramsForUser(Integer userId) {
        List<WorkoutProgram> programs = programRepository.findWithSessionsByUserId(userId);
        return programs.stream()
                .map(this::mapToDto)
                .toList();
    }

    private ProgramCardDTO mapToDto(WorkoutProgram p) {
        ProgramCardDTO dto = new ProgramCardDTO();

        dto.setId(p.getId());
        dto.setName(p.getProgramName());
        dto.setDescription(p.getDescription());
        dto.setGoal(p.getGoal());
        dto.setStatus(p.getProgramStatus());
        dto.setGenerationType(p.getGenerationType());
        dto.setStartDate(p.getStartDate());
        dto.setExpectedEndDate(p.getExpectedEndDate());

        List<WorkoutSession> sessions = p.getSessions();

        int total = sessions != null ? sessions.size() : 0;
        int done = sessions == null ? 0 :
                (int) sessions.stream()
                        .filter(s -> "DONE".equalsIgnoreCase(s.getSessionStatus()))
                        .count();

        int totalMinutes = sessions == null ? 0 :
                sessions.stream()
                        .filter(s -> s.getDurationMinutes() != null)
                        .mapToInt(WorkoutSession::getDurationMinutes)
                        .sum();

        dto.setTotalSessions(total);
        dto.setCompletedSessions(done);
        dto.setProgressPercent(total == 0 ? 0 : (done * 100.0 / total));
        dto.setTotalHours(totalMinutes / 60.0);

        LocalDate today = LocalDate.now();
        dto.setNextSessionDate(
                sessions == null ? null :
                        sessions.stream()
                                .filter(s -> s.getSessionDate() != null)
                                .filter(s -> !"DONE".equalsIgnoreCase(s.getSessionStatus()))
                                .filter(s -> !s.getSessionDate().isBefore(today))
                                .map(WorkoutSession::getSessionDate)
                                .min(LocalDate::compareTo)
                                .orElse(null)
        );

        dto.setRecentSessions(
                sessions == null ? List.of() :
                        sessions.stream()
                                .sorted(Comparator.comparing(WorkoutSession::getSessionDate,
                                        Comparator.nullsLast(LocalDate::compareTo)).reversed())
                                .limit(3)
                                .map(s -> {
                                    ProgramCardDTO.RecentSessionDTO rs =
                                            new ProgramCardDTO.RecentSessionDTO();
                                    rs.setId(s.getId());
                                    rs.setDate(s.getSessionDate());
                                    rs.setStatus(s.getSessionStatus());
                                    rs.setTitle(s.getSessionType()); // à améliorer plus tard
                                    return rs;
                                })
                                .toList()
        );

        return dto;
    }
}
