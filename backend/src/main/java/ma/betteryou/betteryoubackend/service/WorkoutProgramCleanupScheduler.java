package ma.betteryou.betteryoubackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutProgramRepositoryR;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutSessionRepositoryR;
import ma.betteryou.betteryoubackend.repository.Workout.SessionExerciseRepositoryR;  
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkoutProgramCleanupScheduler {

    private final SessionExerciseRepositoryR sessionExerciseRepo;
    private final WorkoutSessionRepositoryR workoutSessionRepository;
    private final WorkoutProgramRepositoryR workoutProgramRepository;

    @Transactional
    @Scheduled(fixedDelay = 10000) // tous les jours à 02:00
    public void cleanupPrograms() {

        LocalDate today = LocalDate.now();

        int exercises = sessionExerciseRepo.deleteExercisesOfFinishedPrograms(today);
        int sessions  = workoutSessionRepository.deleteSessionsOfFinishedPrograms(today);
        int programs  = workoutProgramRepository.deleteFinishedPrograms(today);

        log.info("🧹 CLEANUP → exercises={}, sessions={}, programs={}",
                exercises, sessions, programs);
    }
}



