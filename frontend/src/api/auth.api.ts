import apiClient from "./axios";

export const authApi = {
  login: (phone: string, password: string) =>
    apiClient.post("/api/auth/login/", { phone, password }),
  register: (data: { full_name: string; phone: string; email: string; password: string; address?: string }) =>
    apiClient.post("/api/auth/register/", data),
  refresh: () =>
    apiClient.post("/api/auth/refresh/", {}, { withCredentials: true }),
  me: () =>
    apiClient.get("/api/auth/me/"),
};
