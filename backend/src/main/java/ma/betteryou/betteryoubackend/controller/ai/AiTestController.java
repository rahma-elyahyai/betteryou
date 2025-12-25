package ma.betteryou.betteryoubackend.controller.ai;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.service.ai.AiClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-test")
@RequiredArgsConstructor
public class AiTestController {

    private final AiClient aiClient;

    @GetMapping
    public String test() {
        return aiClient.generateJson("Return ONLY JSON: {\"ok\":true}");
    }
}
