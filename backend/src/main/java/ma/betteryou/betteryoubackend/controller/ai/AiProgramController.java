package ma.betteryou.betteryoubackend.controller.ai;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.ai.GenerateProgramRequest;
import ma.betteryou.betteryoubackend.dto.program.ProgramWizardResponse;
import ma.betteryou.betteryoubackend.service.ai.AiProgramService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/programs")
@RequiredArgsConstructor
public class AiProgramController {

    private final AiProgramService aiProgramService;

    @PostMapping("/generate-week")
    public ProgramWizardResponse generateWeek(@RequestBody GenerateProgramRequest req) {
        return aiProgramService.generateWeekProgram(req);
    }
}
