import apiClient from "./axios";

export const serviceApi = {
  list: (params?: Record<string, unknown>) => 
    apiClient.get("/api/services/", { params }),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/services/", data),
  get: (id: number) =>
    apiClient.get(`/api/services/${id}/`),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient.put(`/api/services/${id}/`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/services/${id}/`),
  bulkUpdate: (data: Record<string, unknown>[]) =>
    apiClient.put("/api/services/bulk/", data),
};
