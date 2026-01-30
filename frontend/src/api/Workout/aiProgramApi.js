import axios from "axios";

// adapte selon ton projet: si tu as déjà une instance axios (api.js), utilise-la
const api = axios.create({
  baseURL: "http://localhost:8080", // ou import.meta.env.VITE_API_URL
  timeout: 60000,
});

export async function generateWeekProgramAI({ userId, userNotes, constraints }) {
  const { data } = await api.post("/api/ai/programs/generate-week", {
    userId,
    userNotes,
    constraints,
  });
  return data;
}
