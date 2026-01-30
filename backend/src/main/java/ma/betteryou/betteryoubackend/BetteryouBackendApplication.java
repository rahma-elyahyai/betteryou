package ma.betteryou.betteryoubackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class BetteryouBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BetteryouBackendApplication.class, args);
    }

    // ✅ Affiche toutes les routes liées à /api/nutrition/ai au démarrage
    @Bean
    CommandLineRunner printNutritionAiMappings(RequestMappingHandlerMapping mapping) {
        return args -> {
            System.out.println("\n================= REGISTERED MAPPINGS (nutrition ai) =================");
            mapping.getHandlerMethods().forEach((info, method) -> {
                String s = info.toString();
                if (s.contains("/api/nutrition/ai")) {
                    System.out.println(">>> " + s + "  ==>  " + method.toString());
                }
            });
            System.out.println("======================================================================\n");
        };
    }
}