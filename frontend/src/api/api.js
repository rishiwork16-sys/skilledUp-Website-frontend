import axios from "axios";

const normalizeBaseUrl = (url) => (url || "").replace(/\/$/, "");

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
