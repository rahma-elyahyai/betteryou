import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionnel: debug global
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err?.response?.status, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

