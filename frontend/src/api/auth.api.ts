import apiClient from "./axios";

export const authApi = {
  login: (phone: string, password: string) =>
    apiClient.post("/api/auth/login/", { phone, password }),
  refresh: () =>
    apiClient.post("/api/auth/refresh/", {}, { withCredentials: true }),
  me: () =>
    apiClient.get("/api/auth/me/"),
};
