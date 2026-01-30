import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

const errorMessage = (err, fallback = "Request failed") => {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    fallback;

  return typeof msg === "string" ? msg : fallback;
};

export const fetchUserPrograms = async (userId) => {
  try {
    const { data } = await API.get(`/programs/user/${userId}`);
    return data;
  } catch (err) {
    throw new Error(errorMessage(err, "Failed to load programs"));
  }
};

// ✅ POST /api/programs?userId=1
export const createProgram = async (payload, userId) => {
  try {
    const { data } = await API.post(`/programs`, payload, {
      params: { userId },
    });
    return data; // { programId, message, sessionIds }
  } catch (err) {
    throw new Error(errorMessage(err, "Failed to create program"));
  }
};
