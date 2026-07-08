import apiClient from "../../../api/axios";

export const ordersApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/api/orders/", { params }),
  get: (id: number) => apiClient.get(`/api/orders/${id}/`),
  updateStatus: (id: number, status: string) => apiClient.put(`/api/orders/${id}/status/`, { status }),
};
