import axios from "axios";


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // même origine => http://92.5.238.53:3000
  timeout: 1500000,
});

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
