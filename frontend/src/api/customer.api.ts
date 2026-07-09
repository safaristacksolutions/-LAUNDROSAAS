import apiClient from "./axios";

export const customerApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/api/customers/", { params }),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/customers/", data),
  get: (id: number) =>
    apiClient.get(`/api/customers/${id}/`),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient.put(`/api/customers/${id}/`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/customers/${id}/`),
  search: (query: string) =>
    apiClient.get("/api/customers/search/", { params: { q: query } }),
};
