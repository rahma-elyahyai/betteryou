package ma.betteryou.betteryoubackend.service.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    // Générer le token
    public String generateToken(String subjectEmail) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(subjectEmail)      
                .issuedAt(now)              
                .expiration(exp)           
                .signWith(key)              
                .compact();
    }

    // Extraire email
    public String extractEmail(String token) {
        return parse(token).getSubject();
    }

    // Vérifier validité
    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Parser
    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)           // ✅ NEW
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
