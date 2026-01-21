import { api } from "./auth"; // adapte le chemin si besoin

export const profileApi = {
  getProfile: () => api.get("/api/profile"),
  updateInfo: (payload) => api.put("/api/profile/info", payload),
  updateObjective: (payload) => api.put("/api/profile/objective", payload),
};
