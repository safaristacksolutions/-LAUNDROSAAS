import apiClient from "../../../api/axios";

export const laundryApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/api/orders/", { params: { status: "received,sorting,washing,drying,ironing,packaging", ...params } }),
  updateStatus: (id: number, status: string) => apiClient.put(`/api/orders/${id}/status/`, { status }),
};
