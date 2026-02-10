import { api } from "../auth";



export async function generateWeekProgramAI({ userId, userNotes, constraints }) {
  const { data } = await api.post("/api/api/ai/programs/generate-week", {
    userId,
    userNotes,
    constraints,
  });
  return data;
}
