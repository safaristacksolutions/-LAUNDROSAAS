import apiClient from "./axios";

export const customerApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/api/customers/", { params }),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/customers/", data),
  get: (id: number) =>
    apiClient.get(`/api/customers/${id}/`),
};
