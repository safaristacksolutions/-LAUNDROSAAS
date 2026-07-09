import apiClient from "./axios";
import { DEMO_MODE, MOCK_ORDERS } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const orderApi = {
  list: (params?: Record<string, unknown>) => {
    if (DEMO_MODE) {
      let filtered = [...MOCK_ORDERS];
      const status = params?.status as string;
      if (status) filtered = filtered.filter((o) => o.status === status);
      const search = params?.search as string;
      if (search) filtered = filtered.filter((o) => o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.order_number.toLowerCase().includes(search.toLowerCase()));
      return mockResponse({ results: filtered, count: filtered.length });
    }
    return apiClient.get("/api/orders/", { params });
  },
  create: (data: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse({ id: Date.now(), order_number: `ORD-${String(2400 + Math.floor(Math.random() * 100))}`, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    return apiClient.post("/api/orders/", data);
  },
  get: (id: number) => {
    if (DEMO_MODE) return mockResponse(MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0]);
    return apiClient.get(`/api/orders/${id}/`);
  },
  updateStatus: (id: number, status: string) => {
    if (DEMO_MODE) return mockResponse({ success: true, status });
    return apiClient.put(`/api/orders/${id}/status/`, { status });
  },
};
