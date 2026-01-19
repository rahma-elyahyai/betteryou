import axios from "axios";

/**
 * Vite: variables injectées au build via import.meta.env
 * Fallback:
 * - en local: localhost:8080
 * - en prod: même hostname que le site + port 8080 (ex: http://92.5.238.53:8080)
 */
const baseURL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : `${window.location.protocol}//${window.location.hostname}:8080`);

export const api = axios.create({ baseURL });


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

// ✅ Auth API
export const authApi = {
  login: (data) => api.post("/api/auth/login", data),
  register: (data) => api.post("/api/auth/register", data),
  me: () => api.get("/api/auth/me"),
  forgotPassword: (data) => api.post("/api/auth/forgot-password", data),
  resetPassword: (data) => api.post("/api/auth/reset-password", data),
};
