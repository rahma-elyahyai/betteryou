package ma.betteryou.betteryoubackend;



import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.springframework.stereotype.Component;

@Disabled
@Data  // Génère getters, setters, equals, hashCode, toString
@RequiredArgsConstructor  // Génère constructeur avec champs final
@Slf4j  // Génère un logger
@Component
public class LombokTest {
    private final String testField = "Test";
    private String anotherField;

    public void testMethod() {
        log.info("Lombok test: {}", testField);
        System.out.println("Test field: " + getTestField()); // Doit être généré par @Data
    }
}
