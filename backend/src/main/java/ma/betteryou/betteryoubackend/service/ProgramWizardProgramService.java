package ma.betteryou.betteryoubackend.service;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.exercise.*;
import ma.betteryou.betteryoubackend.dto.program.ProgramWizardResponse;
import ma.betteryou.betteryoubackend.model.*;
import ma.betteryou.betteryoubackend.repository.Workout.*;
import ma.betteryou.betteryoubackend.repository.Workout.ExerciseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgramWizardProgramService {

    private final WorkoutProgramRepository programRepository;
    private final WorkoutSessionRepository sessionRepository;
    private final SessionExerciseRepository sessionExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProgramWizardResponse createProgram(Long userId, ExercisePickDto payload) {

        // ---------- validations ----------
        if (payload == null) throw new IllegalArgumentException("Payload is null");
        if (payload.getProgramName() == null || payload.getProgramName().isBlank())
            throw new IllegalArgumentException("programName is required");
        if (payload.getGoal() == null || payload.getGoal().isBlank())
            throw new IllegalArgumentException("goal is required");
        if (payload.getGenerationType() == null || payload.getGenerationType().isBlank())
            payload.setGenerationType("MANUAL");
        if (payload.getSessions() == null || payload.getSessions().isEmpty())
            throw new IllegalArgumentException("sessions is required");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // ---------- create program ----------
        WorkoutProgram program = new WorkoutProgram();
        program.setProgramName(payload.getProgramName());
        program.setDescription(payload.getDescription());
        program.setGoal(payload.getGoal());
        program.setGenerationType(payload.getGenerationType());
        program.setProgramStatus("ONGOING");
        program.setStartDate(LocalDate.now());
        program.setUser(user);

        program = programRepository.save(program); // ✅ get id_program

        // ---------- create sessions + session_exercises ----------
        List<Long> createdSessionIds = new ArrayList<>();

        for (SessionRequest sreq : payload.getSessions()) {

            WorkoutSession session = new WorkoutSession();
            session.setProgram(program);
            session.setSessionType(sreq.getSessionType());
            session.setDurationMinutes(sreq.getDurationMinutes() != null ? sreq.getDurationMinutes() : 60);
            session.setSessionStatus("PLANNED");
            session.setSessionDate(null); // ou LocalDate.now() + logique jours

            session = sessionRepository.save(session); // ✅ get id_session
            createdSessionIds.add(session.getId());

            // exercises
            if (sreq.getExercises() != null) {
                for (ExerciseRequest exReq : sreq.getExercises()) {

                    if (exReq.getIdExercise() == null)
                        throw new IllegalArgumentException("Exercise id is required");

                    Exercise ex = exerciseRepository.findById(exReq.getIdExercise())
                            .orElseThrow(() -> new IllegalArgumentException("Exercise not found: " + exReq.getIdExercise()));

                    Integer order = exReq.getOrderInSession() != null ? exReq.getOrderInSession() : 1;

                    SessionExercise se = new SessionExercise();
                    se.setSession(session);
                    se.setExercise(ex);
                    se.setReps(exReq.getReps() != null ? exReq.getReps() : 10);
                    se.setSets(exReq.getSets() != null ? exReq.getSets() : 3);
                    se.setRestSeconds(exReq.getRestSeconds() != null ? exReq.getRestSeconds() : 60);

                    // ✅ embedded id (sessionId, order, exerciseId)
                    se.setId(new SessionExerciseId(session.getId(), order, ex.getId()));

                    sessionExerciseRepository.save(se);
                }
            }
        }

        return new ProgramWizardResponse(
                program.getId(),
                "Program created successfully",
                createdSessionIds
        );
    }
}
