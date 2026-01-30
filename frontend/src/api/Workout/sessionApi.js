// src/api/sessionApi.js
import axios from "axios";

const API = "http://localhost:8080/api";

export async function fetchSessionDetail(sessionId) {
  const res = await axios.get(`${API}/sessions/${sessionId}`);
  return res.data;
}

// ✅ AJOUT : sauvegarder note
export async function saveExerciseNote(sessionId, exerciseId, note) {
  const res = await axios.post(
    `${API}/sessions/${sessionId}/exercises/${exerciseId}/note`,
    { note }
  );
  return res.data; // on renvoie l'exo DTO mis à jour (ou un message)
}

// ✅ AJOUT : sauvegarder performance
export async function savePerformance(sessionId, exerciseId, performance) {
  const res = await axios.post(
    `${API}/sessions/${sessionId}/exercises/${exerciseId}/performance`,
    performance
  );
  return res.data; // on renvoie la perf enregistrée (dto)
}

export async function completeSession(sessionId) {
  const res = await axios.patch(`${API}/sessions/${sessionId}/complete`);
  return res.data;
}

