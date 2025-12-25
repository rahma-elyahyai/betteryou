package ma.betteryou.betteryoubackend.controller.AiChat;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.AiChat.AiChatRequest;
import ma.betteryou.betteryoubackend.dto.AiChat.AiChatResponse;
import ma.betteryou.betteryoubackend.service.AiChat.AiChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping("/chat")   // ---> appelle la méthode chat()
    public AiChatResponse chat(@RequestBody AiChatRequest request) {
        return aiChatService.chat(
                request.getUserId(),
                request.getConversationId(),
                request.getMessage()
        );
    }
}
