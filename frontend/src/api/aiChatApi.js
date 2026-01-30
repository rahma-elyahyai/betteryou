import { api } from "./auth"; 

export async function sendAiMessage({ userId, conversationId, message }) {

  const res = await api.post(`/api/ai/chat`, {
    userId,
    conversationId,
    message,
  });

  // attendu
  return res.data;
}
