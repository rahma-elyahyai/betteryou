package ma.betteryou.betteryoubackend.service.program;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.model.WorkoutProgram;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutProgramRepository;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class ProgramExpirationJob {

    private final WorkoutProgramRepository programRepository;

    @Scheduled(cron = "0 0 0 * * ?") // chaque jour à minuit
    public void expirePrograms() {

        List<WorkoutProgram> expiredPrograms =
                programRepository.findByProgramStatusAndExpectedEndDateBefore(
                        "ONGOING",
                        LocalDate.now()
                );

        for (WorkoutProgram p : expiredPrograms) {
            p.setProgramStatus("EXPIRED");
        }

        programRepository.saveAll(expiredPrograms);
    }
}
