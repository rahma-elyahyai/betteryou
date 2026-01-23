package ma.betteryou.betteryoubackend.service.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendResetLink(String toEmail, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("BetterYou - Reset your password");
        msg.setText("Click this link to reset your password:\n" + resetLink +
                "\n\nThis link expires in 15 minutes.");

        mailSender.send(msg);
    }
}
