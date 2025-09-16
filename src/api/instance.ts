import axios from "axios";
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
        console.log(error)
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
