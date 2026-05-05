import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ── Create the axios instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7002",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (we'll set it after login)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("hypertube_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ── Response interceptor: handle global errors ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      // Token expired or invalid → redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("hypertube_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;