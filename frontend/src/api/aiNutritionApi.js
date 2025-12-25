// src/api/aiNutritionApi.js

const BASE_URL = "http://localhost:8080/api/nutrition/ai";

/**
 * 🔹 Générer un plan nutritionnel par IA
 * POST /api/nutrition/ai/generate
 */
export async function generateAiNutritionPlan(payload) {
  const response = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to generate AI nutrition plan");
  }

  return response.json();
}

/**
 * 🔹 Récupérer tous les plans nutritionnels d’un utilisateur
 * GET /api/nutrition/ai/user/{userId}
 */
export async function getAiNutritionPlansByUser(userId) {
  const response = await fetch(`${BASE_URL}/user/${userId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch nutrition plans");
  }

  return response.json();
}

/**
 * 🔹 Récupérer un plan nutritionnel précis
 * GET /api/nutrition/ai/{planId}
 */
export async function getAiNutritionPlan(planId) {
  const response = await fetch(`${BASE_URL}/${planId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch nutrition plan");
  }

  return response.json();
}

/**
 * 🔹 Récupérer les repas d’un jour précis
 * GET /api/nutrition/ai/{planId}/day/{dayOfWeek}
 * dayOfWeek = Monday | Tuesday | ...
 */
export async function getMealsByDay(planId, dayOfWeek) {
  const response = await fetch(
    `${BASE_URL}/${planId}/day/${dayOfWeek}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch meals for day");
  }

  return response.json();
}
