package ma.betteryou.betteryoubackend.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;

import java.util.*;

@Component
public class AiClient {

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${ai.provider:github-models}")
    private String provider;

    // Generic timeout (seconds) for AI calls
    @Value("${ai.timeout-seconds:60}")
    private int timeoutSeconds;

    // Ollama (legacy) config
    @Value("${ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ai.ollama.model:llama3.2:latest}")
    private String ollamaModel;

    // OpenAI config
    @Value("${ai.openai.base-url:https://api.openai.com}")
    private String openaiBaseUrl;

    @Value("${ai.openai.model:gpt-4-1}")
    private String openaiModel;

    @Value("${ai.openai.api-key:}")
    private String openaiApiKey;

    // GitHub Models (GitHub/Azure Inference) config
    @Value("${ai.github.base-url:https://models.inference.ai.azure.com}")
    private String githubBaseUrl;

    @Value("${ai.github.model:gpt-4.1}")
    private String githubModel;

    @Value("${ai.github.api-key:}")
    private String githubApiKey;

    @Value("${ai.github.api-version:}")
    private String githubApiVersion;

    public String generateJson(String prompt) {
        if ("ollama".equalsIgnoreCase(provider)) {
            return callOllama(prompt);
        }
        if ("openai".equalsIgnoreCase(provider) || "open ai".equalsIgnoreCase(provider)) {
            return callOpenAi(prompt);
        }

        if ("github-models".equalsIgnoreCase(provider) || "github".equalsIgnoreCase(provider)) {
            return callGithubModels(prompt);
        }

        throw new RuntimeException("AI provider not supported: " + provider);
    }

    private RestTemplate buildRestTemplate() {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(20_000);              // 20s
        f.setReadTimeout(timeoutSeconds * 1000);  // from YAML/env
        return new RestTemplate(f);
    }

    private String callOllama(String prompt) {

        // ✅ DEBUG CONFIG
        System.out.println(">>> [OLLAMA] baseUrl=" + ollamaBaseUrl);
        System.out.println(">>> [OLLAMA] model=" + ollamaModel);
        System.out.println(">>> [OLLAMA] readTimeoutSeconds=" + timeoutSeconds);

        String url = ollamaBaseUrl + "/api/chat";

        String system = """
                You are a nutrition plan generator.
                Output ONLY valid JSON.
                No markdown. No explanations.
                Always include ALL 7 days of the week.
                """;

        Map<String, Object> body = new HashMap<>();
        body.put("model", ollamaModel);
        body.put("stream", false);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", system));
        messages.add(Map.of("role", "user", "content", prompt));
        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        System.out.println(">>> [OLLAMA] POST " + url + " (stream=false)");

        int maxAttempts = 3;
        int attempt = 0;
        long t0 = 0L;
        ResponseEntity<String> res = null;
        while (attempt < maxAttempts) {
            attempt++;
            try {
                System.out.println(">>> [OLLAMA] attempt " + attempt + " of " + maxAttempts);
                t0 = System.currentTimeMillis();
                res = buildRestTemplate().exchange(url, HttpMethod.POST, entity, String.class);
                System.out.println(">>> [OLLAMA] response received in " + (System.currentTimeMillis() - t0) + " ms");
                break;
            } catch (ResourceAccessException rae) {
                Throwable cause = rae.getCause();
                boolean isTimeout = cause instanceof java.net.SocketTimeoutException || (rae.getMessage() != null && rae.getMessage().toLowerCase().contains("read timed out"));
                System.out.println(">>> [OLLAMA] request failed on attempt " + attempt + ": " + rae.getMessage());
                if (attempt >= maxAttempts || !isTimeout) {
                    String hint = """
Ollama request failed.
Possible causes: Ollama service down, model not loaded (first-run model loading can take minutes), or network issue.
Suggestions: ensure Ollama is running and the model is pulled (run `ollama pull " + ollamaModel + "`), or increase ai.ollama.timeout-seconds in application.yaml.
""";
                    throw new RuntimeException(hint, rae);
                }
                // backoff before retry
                try {
                    Thread.sleep(2000L * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted while waiting to retry Ollama request", ie);
                }
            }
        }

        if (res == null || !res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
            String status = res == null ? "no response" : String.valueOf(res.getStatusCode());
            throw new RuntimeException("Ollama call failed: " + status);
        }

        try {
            JsonNode root = mapper.readTree(res.getBody());
            String content = root.path("message").path("content").asText();
            return extractFirstJsonObject(content);
        } catch (Exception e) {
            String msg = "Failed to parse Ollama response. Raw response:\n" + (res.getBody() == null ? "<empty>" : res.getBody());
            throw new RuntimeException(msg, e);
        }
    }

    private String callOpenAi(String prompt) {

        System.out.println(">>> [OPENAI] baseUrl=" + openaiBaseUrl);
        System.out.println(">>> [OPENAI] model=" + openaiModel);
        System.out.println(">>> [OPENAI] readTimeoutSeconds=" + timeoutSeconds);

        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            throw new RuntimeException("OpenAI API key is not configured. Set 'ai.openai.api-key' or the OPENAI_API_KEY env var.");
        }

        String url = openaiBaseUrl + "/v1/chat/completions";

        String system = """
                You are a nutrition plan generator.
                Output ONLY valid JSON.
                No markdown. No explanations.
                Always include ALL 7 days of the week.
                """;

        Map<String, Object> body = new HashMap<>();
        body.put("model", openaiModel);
        body.put("stream", false);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", system));
        messages.add(Map.of("role", "user", "content", prompt));
        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        System.out.println(">>> [OPENAI] POST " + url + " (stream=false)");

        int maxAttempts = 3;
        int attempt = 0;
        long t0 = 0L;
        ResponseEntity<String> res = null;
        while (attempt < maxAttempts) {
            attempt++;
            try {
                System.out.println(">>> [OPENAI] attempt " + attempt + " of " + maxAttempts);
                t0 = System.currentTimeMillis();
                res = buildRestTemplate().exchange(url, HttpMethod.POST, entity, String.class);
                System.out.println(">>> [OPENAI] response received in " + (System.currentTimeMillis() - t0) + " ms");
                break;
            } catch (ResourceAccessException rae) {
                Throwable cause = rae.getCause();
                boolean isTimeout = cause instanceof java.net.SocketTimeoutException || (rae.getMessage() != null && rae.getMessage().toLowerCase().contains("read timed out"));
                System.out.println(">>> [OPENAI] request failed on attempt " + attempt + ": " + rae.getMessage());
                if (attempt >= maxAttempts || !isTimeout) {
                    String hint = "OpenAI request failed. Check network, API key and quota.";
                    throw new RuntimeException(hint, rae);
                }
                try {
                    Thread.sleep(2000L * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted while waiting to retry OpenAI request", ie);
                }
            }
        }

        if (res == null || !res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
            String status = res == null ? "no response" : String.valueOf(res.getStatusCode());
            throw new RuntimeException("OpenAI call failed: " + status + " body=" + (res == null ? "<empty>" : res.getBody()));
        }

        try {
            JsonNode root = mapper.readTree(res.getBody());
            // Chat completions: choices[0].message.content
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                String content = message.path("content").asText();
                if (content == null || content.isBlank()) {
                    // fallback to text
                    content = choices.get(0).path("text").asText();
                }
                return extractFirstJsonObject(content);
            }
            throw new RuntimeException("Invalid OpenAI response: missing choices. Raw: " + res.getBody());
        } catch (Exception e) {
            String msg = "Failed to parse OpenAI response. Raw response:\n" + (res.getBody() == null ? "<empty>" : res.getBody());
            throw new RuntimeException(msg, e);
        }
    }

    private String callGithubModels(String prompt) {

        System.out.println(">>> [GITHUB MODELS] baseUrl=" + githubBaseUrl);
        System.out.println(">>> [GITHUB MODELS] model=" + githubModel);
        System.out.println(">>> [GITHUB MODELS] readTimeoutSeconds=" + timeoutSeconds);

        if (githubApiKey == null || githubApiKey.isBlank()) {
            throw new RuntimeException("GitHub Models API key is not configured. Set 'ai.github.api-key' or the GITHUB_MODELS_API_KEY env var.");
        }

        String url = githubBaseUrl + "/v1/models/" + githubModel + "/chat/completions";
        if (githubApiVersion != null && !githubApiVersion.isBlank()) {
            url += "?api-version=" + githubApiVersion;
        }

        String system = """
                You are a nutrition plan generator.
                Output ONLY valid JSON.
                No markdown. No explanations.
                Always include ALL 7 days of the week.
                """;

        Map<String, Object> body = new HashMap<>();
        body.put("model", githubModel);
        body.put("stream", false);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", system));
        messages.add(Map.of("role", "user", "content", prompt));
        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(githubApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        System.out.println(">>> [GITHUB MODELS] POST " + url + " (stream=false)");

        int maxAttempts = 3;
        int attempt = 0;
        long t0 = 0L;
        ResponseEntity<String> res = null;
        while (attempt < maxAttempts) {
            attempt++;
            try {
                System.out.println(">>> [GITHUB MODELS] attempt " + attempt + " of " + maxAttempts);
                t0 = System.currentTimeMillis();
                res = buildRestTemplate().exchange(url, HttpMethod.POST, entity, String.class);
                System.out.println(">>> [GITHUB MODELS] response received in " + (System.currentTimeMillis() - t0) + " ms");
                break;
            } catch (ResourceAccessException rae) {
                Throwable cause = rae.getCause();
                boolean isTimeout = cause instanceof java.net.SocketTimeoutException || (rae.getMessage() != null && rae.getMessage().toLowerCase().contains("read timed out"));
                System.out.println(">>> [GITHUB MODELS] request failed on attempt " + attempt + ": " + rae.getMessage());
                if (attempt >= maxAttempts || !isTimeout) {
                    String hint = "GitHub Models request failed. Check network, API key and quota.";
                    throw new RuntimeException(hint, rae);
                }
                try {
                    Thread.sleep(2000L * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted while waiting to retry GitHub Models request", ie);
                }
            }
        }

        if (res == null || !res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
            String status = res == null ? "no response" : String.valueOf(res.getStatusCode());
            throw new RuntimeException("GitHub Models call failed: " + status + " body=" + (res == null ? "<empty>" : res.getBody()));
        }

        try {
            JsonNode root = mapper.readTree(res.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                String content = message.path("content").asText();
                if (content == null || content.isBlank()) {
                    content = choices.get(0).path("text").asText();
                }
                return extractFirstJsonObject(content);
            }
            throw new RuntimeException("Invalid GitHub Models response: missing choices. Raw: " + res.getBody());
        } catch (Exception e) {
            String msg = "Failed to parse GitHub Models response. Raw response:\n" + (res.getBody() == null ? "<empty>" : res.getBody());
            throw new RuntimeException(msg, e);
        }
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
