package ma.betteryou.betteryoubackend.service.ai.nutrition;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class OpenAiNutritionClient {

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${ai.openai.base-url:https://api.openai.com/v1}")
    private String openaiBaseUrl;

    @Value("${ai.openai.model:gpt-4o-mini}")
    private String openaiModel;

    // lit directement la variable d'environnement chargée par .env
    @Value("${OPENAI_API_KEY:}")
    private String openaiApiKey;

    @Value("${ai.openai.timeout-seconds:90}")
    private int timeoutSeconds;

    public String generateJson(String prompt) {

        System.out.println(">>> [OPENAI-NUTR] baseUrl=" + openaiBaseUrl);
        System.out.println(">>> [OPENAI-NUTR] model=" + openaiModel);
        System.out.println(">>> [OPENAI-NUTR] apiKeyPresent=" + (openaiApiKey != null && !openaiApiKey.isBlank()));
        System.out.println(">>> [OPENAI-NUTR] timeoutSeconds=" + timeoutSeconds);

        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            throw new RuntimeException("OPENAI_API_KEY is missing or empty (check .env loading)");
        }

        String url = openaiBaseUrl + "/chat/completions";

        Map<String, Object> body = new HashMap<>();
        body.put("model", openaiModel);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "Return ONLY valid JSON. No markdown. No extra text."
        ));
        messages.add(Map.of(
                "role", "user",
                "content", prompt
        ));
        body.put("messages", messages);

        // Force JSON output (très utile)
        body.put("response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> res = buildRestTemplate().exchange(url, HttpMethod.POST, entity, String.class);

            System.out.println(">>> [OPENAI-NUTR] HTTP " + res.getStatusCode());

            if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
                throw new RuntimeException("OpenAI returned non-2xx or empty body");
            }

            JsonNode root = mapper.readTree(res.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();

            return extractFirstJsonObject(content);

        } catch (HttpClientErrorException e) {
            System.out.println(">>> [OPENAI-NUTR] HTTP ERROR STATUS = " + e.getStatusCode());
            System.out.println(">>> [OPENAI-NUTR] ERROR BODY = ");
            System.out.println(e.getResponseBodyAsString());
            throw new RuntimeException("OpenAI HTTP error: " + e.getStatusCode(), e);

        } catch (ResourceAccessException e) {
            System.out.println(">>> [OPENAI-NUTR] TIMEOUT / NETWORK ERROR");
            throw new RuntimeException("OpenAI network/timeout error", e);

        } catch (Exception e) {
            System.out.println(">>> [OPENAI-NUTR] UNEXPECTED ERROR");
            throw new RuntimeException("OpenAI unexpected error: " + e.getMessage(), e);
        }
    }

    private RestTemplate buildRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(20_000);
        factory.setReadTimeout(timeoutSeconds * 1000);
        return new RestTemplate(factory);
    }

    private String extractFirstJsonObject(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start < 0 || end < 0 || end <= start) {
            throw new RuntimeException("AI output is not valid JSON:\n" + text);
        }
        return text.substring(start, end + 1).trim();
    }
}
