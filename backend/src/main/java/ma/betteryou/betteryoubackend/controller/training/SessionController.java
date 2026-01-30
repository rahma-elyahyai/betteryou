package ma.betteryou.betteryoubackend.controller.training;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.session.*;
import ma.betteryou.betteryoubackend.service.SessionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // optionnel si tu as CORS global
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/{id}")
    public SessionDetailDto getSessionDetail(@PathVariable Long id) {
        return sessionService.getSessionDetail(id);
    }

    @PostMapping("/{sessionId}/exercises/{exerciseId}/note")
    public SessionExerciseDetailDto saveNote(
            @PathVariable Long sessionId,
            @PathVariable Long exerciseId,
            @RequestBody NoteRequest req
    ) {
        return sessionService.saveExerciseNote(sessionId, exerciseId, req.getNote());
    }

    @PostMapping("/{sessionId}/exercises/{exerciseId}/performance")
    public PerformanceDto savePerformance(
            @PathVariable Long sessionId,
            @PathVariable Long exerciseId,
            @RequestBody PerformanceRequest req
    ) {
        return sessionService.savePerformance(sessionId, exerciseId, req);
    }

    // ✅ IMPORTANT: PATCH (pas POST)
    @PatchMapping("/{id}/complete")
    public SessionDetailDto complete(@PathVariable Long id) {
        return sessionService.completeSession(id);
    }
}
