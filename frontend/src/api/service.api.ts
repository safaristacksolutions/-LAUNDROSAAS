import apiClient from "./axios";

export const serviceApi = {
  list: () => apiClient.get("/api/services/"),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/services/", data),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient.put(`/api/services/${id}/`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/services/${id}/`),
};
