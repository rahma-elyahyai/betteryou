package ma.betteryou.betteryoubackend.controller.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AiDebugController {

    @Value("${OPENAI_API_KEY:}")
    private String openaiKey;

    @GetMapping("/api/debug/openai-key")
    public String debugOpenAiKey() {
        boolean present = openaiKey != null && !openaiKey.isBlank();
        int len = present ? openaiKey.length() : 0;
        String prefix = present ? openaiKey.substring(0, Math.min(8, len)) : "NONE";
        return "OPENAI_API_KEY present=" + present + " | length=" + len + " | prefix=" + prefix;
    }

    @GetMapping("/api/debug/env-openai-key")
    public String debugEnvKey() {
        String env = System.getenv("OPENAI_API_KEY");
        boolean present = env != null && !env.isBlank();
        int len = present ? env.length() : 0;
        String prefix = present ? env.substring(0, Math.min(8, len)) : "NONE";
        return "System.getenv OPENAI_API_KEY present=" + present + " | length=" + len + " | prefix=" + prefix;
    }
}
