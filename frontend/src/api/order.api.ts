import apiClient from "./axios";

export const orderApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/api/orders/", { params }),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/orders/", data),
  get: (id: number) =>
    apiClient.get(`/api/orders/${id}/`),
  updateStatus: (id: number, status: string) =>
    apiClient.put(`/api/orders/${id}/status/`, { status }),
};
