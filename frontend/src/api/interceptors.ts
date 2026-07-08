import apiClient from "./axios";
import { useAuthStore } from "../store/authStore";

export function setupInterceptors() {
  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const branchId = useAuthStore.getState().activeBranchId;
    if (branchId) {
      config.headers["X-Branch-Id"] = branchId;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const { data } = await apiClient.post("/api/auth/refresh/", {}, { withCredentials: true });
          useAuthStore.getState().setToken(data.access);
          error.config.headers.Authorization = `Bearer ${data.access}`;
          return apiClient(error.config);
        } catch {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
}
