package ma.betteryou.betteryoubackend.repository.chat;

import ma.betteryou.betteryoubackend.entity.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {


    // limiter le contexte a 10 messsgs a AI POUR réduire le coût OpenAI
    List<ChatMessage> findTop10ByUser_IdUserAndConversationIdOrderByMessageTimeAsc(
            long idUser, String conversationId
    );

    // afficher tout le chat a user
    List<ChatMessage> findByUser_IdUserAndConversationIdOrderByMessageTimeAsc(
            long idUser, String conversationId
    );
}
