import axios from "axios";


// Solution PRO : Une ligne, zéro changement manuel
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
});

// Vérification (optionnel, pour debug)
console.log("✅ Mode:", import.meta.env.MODE);
console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

// ✅ Interceptor → ajoute le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🆕 RESPONSE INTERCEPTOR → gère les erreurs d'autorisation
api.interceptors.response.use(
  // ✅ Si la requête réussit, on retourne la réponse
  (response) => response,
  
  // ❌ Si la requête échoue, on gère les erreurs
  (error) => {
    const status = error?.response?.status;
    
    // 🔴 Erreur 401 : Non authentifié (token invalide/expiré)
    if (status === 401) {
      console.warn("🔴 401 Unauthorized - Redirecting to login...");
      
      // Nettoyer le localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Éviter les boucles de redirection (si on est déjà sur /login)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    // 🔴 Erreur 403 : Authentifié mais pas autorisé (accès refusé)
    if (status === 403) {
      console.warn("🔴 403 Forbidden - Redirecting to unauthorized...");
      
      // Éviter les boucles de redirection
      if (window.location.pathname !== "/unauthorized") {
        window.location.href = "/unauthorized";
      }
    }
    
    // Relancer l'erreur pour que les composants puissent la gérer si besoin
    return Promise.reject(error);
  }
);

// ✅ Auth API
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};
// ✅ AI Nutrition API
export const aiNutritionApi = {
  test: () => api.get("/nutrition/ai/test"),
  generate: (payload) => api.post("/nutrition/ai/generate", payload, { timeout: 300000 }),
  getWeek: (planId) => api.get(`/nutrition/ai/plans/${planId}/week`),
  getDay: (planId, dayOfWeek) =>
    api.get(`/nutrition/ai/plans/${planId}/day`, { params: { dayOfWeek } }),
};

