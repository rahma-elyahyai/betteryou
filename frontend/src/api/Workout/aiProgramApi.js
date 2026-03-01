import { api } from "../auth";
import axios from "axios";

const FALLBACK_BASE = "https://betteryou-backend-rbly.onrender.com";

export async function generateWeekProgramAI({ userId, userNotes, constraints }) {
  const token = localStorage.getItem("token");

  // si baseURL est vide ou contient localhost:5173 => fallback
  const baseURL = api?.defaults?.baseURL;
  const useFallback =
    !baseURL || String(baseURL).includes("localhost:5173");

  if (useFallback) {
    const { data } = await axios.post(
      `${FALLBACK_BASE}/api/ai/programs/generate-week`,
      { userId, userNotes, constraints },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
  }

  const { data } = await api.post("/api/ai/programs/generate-week", {
    userId,
    userNotes,
    constraints,
  });
  return data;
}