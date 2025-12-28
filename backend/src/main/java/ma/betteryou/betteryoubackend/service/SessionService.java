package ma.betteryou.betteryoubackend.service;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.session.*;
import ma.betteryou.betteryoubackend.model.Exercise;
import ma.betteryou.betteryoubackend.model.SessionExercise;
import ma.betteryou.betteryoubackend.repository.Workout.SessionExerciseRepository;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutSessionSimpleRepository;
import ma.betteryou.betteryoubackend.model.WorkoutSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final WorkoutSessionSimpleRepository sessionRepository;
    private final SessionExerciseRepository sessionExerciseRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    @Transactional(readOnly = true)
    public SessionDetailDto getSessionDetail(Long sessionId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        SessionDetailDto dto = new SessionDetailDto();
        dto.setId(session.getId());
        dto.setSessionDate(session.getSessionDate() != null ? session.getSessionDate().format(DATE_FMT) : null);
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setSessionStatus(String.valueOf(session.getSessionStatus()));
        dto.setSessionType(String.valueOf(session.getSessionType()));
        dto.setProgramName(session.getProgram() != null ? session.getProgram().getProgramName() : null);

        List<SessionExercise> ses = sessionExerciseRepository.findBySessionIdOrdered(sessionId);

        List<SessionExerciseDetailDto> exDtos = ses.stream()
                .map(this::mapSessionExerciseToDto)
                .toList();

        dto.setExercises(exDtos);
        return dto;
    }

    @Transactional
    public SessionExerciseDetailDto saveExerciseNote(Long sessionId, Long exerciseId, String note) {
        SessionExercise se = sessionExerciseRepository.findOne(sessionId, exerciseId)
                .orElseThrow(() -> new RuntimeException("SessionExercise not found"));

        se.setNote(note);
        sessionExerciseRepository.save(se);

        return mapSessionExerciseToDto(se);
    }

    @Transactional
    public PerformanceDto savePerformance(Long sessionId, Long exerciseId, PerformanceRequest req) {
        // ✅ pour l’instant: on renvoie juste ce que le front a envoyé
        // (si tu veux stockage DB, on le fera après)
        return new PerformanceDto(req.getDate(), req.getWeight(), req.getReps(), req.getSets());
    }

    private SessionExerciseDetailDto mapSessionExerciseToDto(SessionExercise se) {
        Exercise ex = se.getExercise();

        SessionExerciseDetailDto x = new SessionExerciseDetailDto();
        x.setIdExercise(ex.getId());
        x.setExerciseName(ex.getExerciseName());
        x.setDescription(ex.getDescription());

        x.setSets(se.getSets());
        x.setReps(se.getReps() != null ? String.valueOf(se.getReps()) : null);
        x.setRestSeconds(se.getRestSeconds());
        x.setOrderInSession(se.getId() != null ? se.getId().getOrderInSession() : null);

        x.setTargetMuscle(ex.getTargetMuscle());
        x.setDifficultyLevel(ex.getDifficultyLevel());
        x.setEquipmentNeeded(ex.getEquipmentsNeeded());
        x.setCaloriesBurned(se.getCaloriesBurned() != null ? se.getCaloriesBurned().intValue() : 0);

        // ✅ NEW
        x.setNote(se.getNote());

        // videoUrl: seulement si ton Exercise a ce champ (sinon commente)
        x.setVideoUrl(ex.getVideoUrl());

        // perf history: pour l’instant vide
        x.setPerformanceHistory(List.of());

        return x;
    }

    @Transactional
    public SessionDetailDto completeSession(Long sessionId) {
    WorkoutSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

    // optionnel: empêcher si déjà MISSED
    if ("MISSED".equalsIgnoreCase(session.getSessionStatus())) {
        throw new RuntimeException("Cannot complete a MISSED session.");
    }

    session.setSessionStatus("DONE"); // ✅ PLANNED -> DONE
    sessionRepository.save(session);

    return getSessionDetail(sessionId); // renvoie dto à jour
}

}
