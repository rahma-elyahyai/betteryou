package ma.betteryou.betteryoubackend.entity.chat;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import ma.betteryou.betteryoubackend.entity.enums.SenderRole;

import ma.betteryou.betteryoubackend.entity.user.User;

@Entity
@Table(name = "chat_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_message")
    private Long idMessage;

    @Column(name = "message_time", nullable = false)
    private LocalDateTime messageTime;

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String messageText;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_role", length = 10, nullable = false)
    private SenderRole senderRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @Column(name = "conversation_id", nullable = false)
    private String conversationId;
}
