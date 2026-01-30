package ma.betteryou.betteryoubackend.service.program;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.model.WorkoutProgramR;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutProgramRepositoryR;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class ProgramExpirationJob {

    private final WorkoutProgramRepositoryR programRepository;

    @Scheduled(cron = "0 0 0 * * ?") // chaque jour à minuit
    public void expirePrograms() {

        List<WorkoutProgramR> expiredPrograms =
                programRepository.findByProgramStatusAndExpectedEndDateBefore(
                        "ONGOING",
                        LocalDate.now()
                );

        for (WorkoutProgramR p : expiredPrograms) {
            p.setProgramStatus("EXPIRED");
        }

        programRepository.saveAll(expiredPrograms);
    }
}
