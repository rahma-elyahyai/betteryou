package ma.betteryou.betteryoubackend.dto.AiChat;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AiChatResponse {
    private String conversationId;
    private String reply;
}
