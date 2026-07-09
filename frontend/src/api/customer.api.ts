import apiClient from "./axios";
import { DEMO_MODE, MOCK_CUSTOMERS } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const customerApi = {
  list: (params?: Record<string, unknown>) => {
    if (DEMO_MODE) {
      const phone = params?.phone as string;
      const filtered = phone ? MOCK_CUSTOMERS.filter((c) => c.phone.includes(phone)) : MOCK_CUSTOMERS;
      return mockResponse({ results: filtered, count: filtered.length });
    }
    return apiClient.get("/api/customers/", { params });
  },
  create: (data: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse({ id: Date.now(), ...data, created_at: new Date().toISOString() });
    return apiClient.post("/api/customers/", data);
  },
  get: (id: number) => {
    if (DEMO_MODE) return mockResponse(MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0]);
    return apiClient.get(`/api/customers/${id}/`);
  },
};
