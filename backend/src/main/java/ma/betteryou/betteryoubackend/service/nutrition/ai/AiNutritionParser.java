package ma.betteryou.betteryoubackend.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class AiNutritionParser {

    private final ObjectMapper mapper = new ObjectMapper();

    public AiNutritionAiResponse parse(String json) {
        try {
            if (json == null || json.isBlank()) {
                throw new RuntimeException("AI JSON is empty");
            }
            return mapper.readValue(json, AiNutritionAiResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI JSON into AiNutritionAiResponse: " + e.getMessage(), e);
        }
    }
}
