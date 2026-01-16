package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.auth.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // SELECT * FROM password_reset_tokens WHERE token = ?
    Optional<PasswordResetToken> findByToken(String token);

    // DELETE FROM password_reset_tokens WHERE user_id = ?
    void deleteByUser_IdUser(Long idUser);
}
