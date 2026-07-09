import apiClient from "./axios";

export const branchApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/api/branches/", { params }),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/branches/", data),
  get: (id: number) =>
    apiClient.get(`/api/branches/${id}/`),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient.put(`/api/branches/${id}/`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/branches/${id}/`),
  setMain: (id: number) =>
    apiClient.post(`/api/branches/${id}/set-main/`),
  getStats: (id: number) =>
    apiClient.get(`/api/branches/${id}/stats/`),
};
