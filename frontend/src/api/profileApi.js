import { api } from "./auth"; // adapte le chemin si besoin

export const profileApi = {
  getProfile: () => api.get("/profile"),
  updateInfo: (payload) => api.put("/profile/info", payload),
  updateObjective: (payload) => api.put("/profile/objective", payload),
};
