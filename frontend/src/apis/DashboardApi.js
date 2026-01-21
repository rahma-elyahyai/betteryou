import { api } from "@/api/auth.js";

export async function fetchDashboard(userId) {
  console.log("hello");

  const response = await api.get(`/api/dashboard/${userId}`);

  console.log("soukaina");

  return response.data;
}
