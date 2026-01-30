package ma.betteryou.betteryoubackend.dto.AiChat;

import lombok.Data;

@Data
public class AiChatRequest {
    private long userId;          
    private String conversationId;   // null => nouvelle conversation
    private String message;
}
