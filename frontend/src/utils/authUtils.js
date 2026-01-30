// src/utils/authUtils.js
import { authApi } from "@/api/auth";

export async function getCurrentUserId() {
  const res = await authApi.me();
  return res.data.idUser; // 🔥 clé exacte venant du backend
}

export async function getUserEmail() {
  const res = await authApi.me();
  return res.data.email; // 
}

export async function getUserName() {
  const res = await authApi.me();
  return res.data.firstName; // 🔥 clé exacte venant du backend
}