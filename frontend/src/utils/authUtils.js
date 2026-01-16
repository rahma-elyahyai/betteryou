// src/utils/authUtils.js
import { authApi } from "@/api/auth";

export async function getCurrentUserId() {
  const res = await authApi.me();
  return res.data.idUser; // 🔥 clé exacte venant du backend
}
