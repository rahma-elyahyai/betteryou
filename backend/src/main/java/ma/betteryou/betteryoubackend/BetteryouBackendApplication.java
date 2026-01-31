package ma.betteryou.betteryoubackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BetteryouBackendApplication {

    public static void main(String[] args) {
        // Charger le fichier .env et définir les variables système
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")  // Cherche .env à la racine du projet
                    .ignoreIfMissing()
                    .load();
            
            // ✅ AJOUT DES LOGS DE DEBUG
            // System.out.println("========== DOTENV LOADED ==========");
            // System.out.println("OPENAI_API_KEY présent ? " + (dotenv.get("OPENAI_API_KEY") != null));
            // System.out.println("DATABASE_URL présent ? " + (dotenv.get("DATABASE_URL") != null));
            // System.out.println("MAIL_USERNAME présent ? " + (dotenv.get("MAIL_USERNAME") != null));
            // System.out.println("===================================");
            
            dotenv.entries().forEach(entry -> 
                System.setProperty(entry.getKey(), entry.getValue())
            );
            
        } catch (Exception e) {
            System.err.println("⚠️ Erreur chargement .env : " + e.getMessage());
            e.printStackTrace();
        }
        
        SpringApplication.run(BetteryouBackendApplication.class, args);
    }
}