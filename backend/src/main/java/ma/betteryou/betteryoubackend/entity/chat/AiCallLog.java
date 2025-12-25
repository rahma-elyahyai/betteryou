package ma.betteryou.betteryoubackend.entity.chat;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import ma.betteryou.betteryoubackend.entity.chat.ChatMessage;


@Entity
@Table(name = "ai_call_log" )
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiCallLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_call")
    private Long idCall;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "called_at")
    private LocalDateTime calledAt;

    @Column(name = "request_payload", columnDefinition = "TEXT")
    private String requestPayload;

    @Column(name = "response_payload", columnDefinition = "TEXT")
    private String responsePayload;

    @Column(name = "model_used", length = 50)
    private String modelUsed;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_message", nullable = false, unique = true)
    private ChatMessage chatMessage;

    public void error(String string, Exception e) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'error'");
    }
}
