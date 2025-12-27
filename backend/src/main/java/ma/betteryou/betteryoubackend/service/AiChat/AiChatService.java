// package ma.betteryou.betteryoubackend.service.AiChat;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import ma.betteryou.betteryoubackend.dto.AiChat.AiChatResponse;
// import ma.betteryou.betteryoubackend.entity.chat.AiCallLog;
// import ma.betteryou.betteryoubackend.entity.chat.ChatMessage;
// import ma.betteryou.betteryoubackend.entity.enums.SenderRole;
// import ma.betteryou.betteryoubackend.entity.user.User;
// import ma.betteryou.betteryoubackend.repository.UserRepository;
// import ma.betteryou.betteryoubackend.repository.chat.AiCallLogRepository;
// import ma.betteryou.betteryoubackend.repository.chat.ChatMessageRepository;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.HttpStatusCodeException;
// import org.springframework.web.client.RestTemplate;

// import java.time.LocalDateTime;
// import java.util.*;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// public class AiChatService {

//     private final UserRepository userRepository;
//     private final ChatMessageRepository chatMessageRepository;
//     private final AiCallLogRepository aiCallLogRepository;

//     private final ObjectMapper objectMapper = new ObjectMapper();
//     private final RestTemplate restTemplate = new RestTemplate();

//     @Value("${openai.api-key}")
//     private String apiKey;

//     @Value("${openai.model:gpt-4o-mini}")
//     private String model;

//     private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

//     public AiChatResponse chat(long userId, String conversationId, String userMessage) {

//         //if (userId == null) throw new IllegalArgumentException("userId is required");
//         if (userMessage == null || userMessage.trim().isEmpty())
//             throw new IllegalArgumentException("message is required");

//         // Logs utiles (sans afficher la clé)
//         log.info("AI chat called: userId={}, conversationId={}", userId, conversationId);
//         log.info("OpenAI model={}", model);
//         log.info("OpenAI apiKey present? {}", (apiKey != null && !apiKey.isBlank()));

//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

//         String convId = (conversationId == null || conversationId.isBlank())
//                 ? UUID.randomUUID().toString()
//                 : conversationId;

//         // 1) Save USER message
//         ChatMessage userMsg = ChatMessage.builder()
//                 .messageTime(LocalDateTime.now())
//                 .messageText(userMessage.trim())
//                 .senderRole(SenderRole.USER)
//                 .conversationId(convId)
//                 .user(user)
//                 .build();
//         userMsg = chatMessageRepository.save(userMsg);

//         // 2) History (last 10 messages)
//         List<ChatMessage> history = chatMessageRepository
//                 .findTop10ByUser_IdUserAndConversationIdOrderByMessageTimeAsc(userId, convId);

//         // 3) Build request
//         String systemPrompt = buildSystemPrompt(user);
//         Map<String, Object> requestBody = buildOpenAiRequest(systemPrompt, history);

//         String requestJson;
//         try {
//             requestJson = objectMapper.writeValueAsString(requestBody);
//         } catch (Exception e) {
//             requestJson = "{\"error\":\"failed to serialize request\"}";
//         }

//         // 4) Create DB log (AiCallLog)
//         AiCallLog aiCallLog = AiCallLog.builder()
//                 .status("PENDING")
//                 .calledAt(LocalDateTime.now())
//                 .requestPayload(requestJson)
//                 .modelUsed(model)
//                 .chatMessage(userMsg)
//                 .build();
//         aiCallLog = aiCallLogRepository.save(aiCallLog);

//         String aiReplyText;
//         String responseJson;

//         try {
//             ResponseEntity<Map> response = callOpenAi(requestBody);

//             responseJson = objectMapper.writeValueAsString(response.getBody());
//             aiReplyText = extractAssistantText(response.getBody());

//             aiCallLog.setStatus("SUCCESS");
//             aiCallLog.setResponsePayload(responseJson);
//             aiCallLogRepository.save(aiCallLog);

//         } catch (HttpStatusCodeException ex) {
//             // ✅ Ici tu récupères le vrai message OpenAI (401/429/...)
//             String status = String.valueOf(ex.getStatusCode().value());
//             String body = ex.getResponseBodyAsString();

//             aiCallLog.setStatus("FAILED");
//             aiCallLog.setResponsePayload("{\"httpStatus\":" + status + ",\"body\":" + safeJson(body) + "}");
//             aiCallLogRepository.save(aiCallLog);

//             log.error("OpenAI HTTP error: status={}, body={}", status, body);

//             aiReplyText = "Désolé, je narrive pas à répondre maintenant. Réessaie dans quelques secondes.";

//         } catch (Exception ex) {
//             aiCallLog.setStatus("FAILED");
//             aiCallLog.setResponsePayload("{\"error\":" + safeJson(ex.getClass().getSimpleName() + ": " + ex.getMessage()) + "}");
//             aiCallLogRepository.save(aiCallLog);

//             log.error("OpenAI call failed", ex);

//             aiReplyText = "Désolé, je n arrive pas à répondre maintenant. Réessaie dans quelques secondes.";
//         }

//         // 5) Save AI message
//         ChatMessage aiMsg = ChatMessage.builder()
//                 .messageTime(LocalDateTime.now())
//                 .messageText(aiReplyText)
//                 .senderRole(SenderRole.AI)
//                 .conversationId(convId)
//                 .user(user)
//                 .build();
//         chatMessageRepository.save(aiMsg);

//         return new AiChatResponse(convId, aiReplyText);
//     }

//     private ResponseEntity<Map> callOpenAi(Map<String, Object> body) {
//         HttpHeaders headers = new HttpHeaders();
//         headers.setBearerAuth(apiKey);
//         headers.setContentType(MediaType.APPLICATION_JSON);

//         HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
//         return restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, Map.class);
//     }

//     private Map<String, Object> buildOpenAiRequest(String systemPrompt, List<ChatMessage> history) {
//         List<Map<String, String>> messages = new ArrayList<>();
//         messages.add(Map.of("role", "system", "content", systemPrompt));

//         for (ChatMessage m : history) {
//             String role = (m.getSenderRole() == SenderRole.USER) ? "user" : "assistant";
//             messages.add(Map.of("role", role, "content", m.getMessageText()));
//         }

//         Map<String, Object> body = new HashMap<>();
//         body.put("model", model);
//         body.put("messages", messages);
//         body.put("temperature", 0.4);
//         body.put("max_tokens", 350);
//         return body;
//     }

//     private String extractAssistantText(Map body) {
//         try {
//             List choices = (List) body.get("choices");
//             Map first = (Map) choices.get(0);
//             Map message = (Map) first.get("message");
//             return String.valueOf(message.get("content")).trim();
//         } catch (Exception e) {
//             return "Je n ai pas pu générer une réponse claire. Peux-tu reformuler ta question ?";
//         }
//     }

//     private String buildSystemPrompt(User user) {
//         return """
//         Tu es BetterYou AI Assistant.
//         Domaine STRICT : nutrition, sport, entraînement, récupération, sommeil, hydratation, habitudes saines.
//         Si la question est hors domaine (politique, hacking, code, etc.), refuse poliment et redirige vers sport/nutrition.
//         Interdit : diagnostic médical, prescriptions, médicaments. Si symptôme/urgence -> recommander un professionnel.
//         Réponses : courtes, pratiques, structurées.

//         Contexte utilisateur :
//         - Objectif: %s
//         - Niveau: %s
//         - Activité: %s
//         - Taille(cm): %s
//         """.formatted(
//                 String.valueOf(user.getGoal()),
//                 String.valueOf(user.getFitnessLevel()),
//                 String.valueOf(user.getActivityLevel()),
//                 String.valueOf(user.getHeightCm())
//         );
//     }

//     // transforme une string en JSON string safe: "abc" => "\"abc\""
//     private String safeJson(String s) {
//         try {
//             return objectMapper.writeValueAsString(s);
//         } catch (Exception e) {
//             return "\"\"";
//         }
//     }
// }
