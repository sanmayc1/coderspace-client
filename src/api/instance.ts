import axios from "axios";
import { logout } from "./auth/auth.api";
import { store } from "@/app/store";
import { clearAuth } from "@/app/redux-slice/authReducer";
const baseURL = import.meta.env.VITE_BASE_URL;

export const coderspaceBackend = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

coderspaceBackend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message === "Invalid or expired token" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return coderspaceBackend(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await coderspaceBackend.post("/auth/refresh");
        processQueue(null);
        return coderspaceBackend(originalRequest);
      } catch (error) {
        processQueue(error);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else if (
      (error.response.status === 403 &&
        error.response.data.message === "Your Account blocked by admin") ||
      (error.response.status === 403 &&
        error.response.data.message ===
          "Token has been revoked or blacklisted") ||
      (error.response.status === 403 &&
        error.response.data.message === "Session Expired")
    ) {
      try {
        await logout();
        store.dispatch(clearAuth());
      } catch (error) {
        console.log(error);
      }
    }

    return Promise.reject(error);
  }
);
