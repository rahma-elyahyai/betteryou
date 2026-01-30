import axios from "axios";


// Solution PRO : Une ligne, zéro changement manuel
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // même origine => http://92.5.238.53:3000
  timeout: 1500000,
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
  login: (data) => api.post("/api/auth/login", data),
  register: (data) => api.post("/api/auth/register", data),
  me: () => api.get("/api/auth/me"),
  forgotPassword: (data) => api.post("/api/auth/forgot-password", data),
  resetPassword: (data) => api.post("/api/auth/reset-password", data),
};
