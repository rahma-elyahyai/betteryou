package ma.betteryou.betteryoubackend.repository.chat;

import ma.betteryou.betteryoubackend.entity.chat.AiCallLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiCallLogRepository extends JpaRepository<AiCallLog, Long> { }
