package ma.betteryou.betteryoubackend.controller.program;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.exercise.ExercisePickDto;
import ma.betteryou.betteryoubackend.dto.program.ProgramWizardResponse;
import ma.betteryou.betteryoubackend.dto.program.ProgramCardDTO;
import ma.betteryou.betteryoubackend.service.ProgramWizardProgramService;
import ma.betteryou.betteryoubackend.service.program.ProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProgramController {

    private final ProgramService programService;
    private final ProgramWizardProgramService programWizardProgramService;

    @GetMapping("/user/{userId}")
    public List<ProgramCardDTO> getUserPrograms(@PathVariable Integer userId) {
        return programService.getProgramsForUser(userId);
    }

    // ✅ NEW: create program (ton front: POST /api/programs?userId=1)
    @PostMapping
    public ResponseEntity<ProgramWizardResponse> createProgram(
            @RequestParam Long userId,
            @RequestBody ExercisePickDto payload
    ) {
        return ResponseEntity.ok(programWizardProgramService.createProgram(userId, payload));
    }
    @GetMapping("/ping")
    public String ping() { return "ok"; }

}
