package ma.betteryou.betteryoubackend.controller.training;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.exercise.ExercisePickDto;
import ma.betteryou.betteryoubackend.dto.exercise.ExerciseSearchResponse;
import ma.betteryou.betteryoubackend.dto.exercise.MetadataResponse;
import ma.betteryou.betteryoubackend.dto.program.ProgramWizardResponse;
import ma.betteryou.betteryoubackend.service.ProgramWizardProgramService;
import ma.betteryou.betteryoubackend.service.ProgramWizardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program-wizard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProgramWizardController {

    private final ProgramWizardProgramService programWizardProgramService;
    private final ProgramWizardService programWizardService;

    // ✅ NEW: metadata
    @GetMapping("/metadata")
    public ResponseEntity<MetadataResponse> getMetadata() {
        return ResponseEntity.ok(programWizardService.getMetadata());
    }

    // ✅ NEW: search exercises
    // GET /api/program-wizard/exercises/search?category=STRENGTH&equipment=HOME&muscles=Chest&muscles=Triceps
    @GetMapping("/exercises/search")
    public ResponseEntity<List<ExerciseSearchResponse>> searchExercises(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) List<String> muscles
    ) {
        return ResponseEntity.ok(programWizardService.searchExercises(category, equipment, muscles));
    }

    // ✅ already exists: create program
    @PostMapping("/programs")
    public ResponseEntity<ProgramWizardResponse> createProgram(
            @RequestParam Long userId,
            @RequestBody ExercisePickDto payload
    ) {
        return ResponseEntity.ok(programWizardProgramService.createProgram(userId, payload));
    }
}
