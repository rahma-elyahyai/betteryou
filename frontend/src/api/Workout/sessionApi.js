// src/api/sessionApi.js
import { api } from "../auth";


export async function fetchSessionDetail(sessionId) {
  const res = await api.get(`/api/sessions/${sessionId}`);
  return res.data;
}

// ✅ AJOUT : sauvegarder note
export async function saveExerciseNote(sessionId, exerciseId, note) {
  const res = await api.post(
    `/api/sessions/${sessionId}/exercises/${exerciseId}/note`,
    { note }
  );
  return res.data; // on renvoie l'exo DTO mis à jour (ou un message)
}

// ✅ AJOUT : sauvegarder performance
export async function savePerformance(sessionId, exerciseId, performance) {
  const res = await api.post(
    `/api/sessions/${sessionId}/exercises/${exerciseId}/performance`,
    performance
  );
  return res.data; // on renvoie la perf enregistrée (dto)
}

export async function completeSession(sessionId) {
  const res = await api.patch(`/api/sessions/${sessionId}/complete`);
  return res.data;
}

