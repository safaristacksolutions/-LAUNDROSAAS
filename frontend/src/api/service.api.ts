import apiClient from "./axios";
import { DEMO_MODE, MOCK_SERVICES } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const serviceApi = {
  list: () => DEMO_MODE ? mockResponse(MOCK_SERVICES) : apiClient.get("/api/services/"),
  create: (data: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse({ id: Date.now(), ...data, is_active: true });
    return apiClient.post("/api/services/", data);
  },
  update: (id: number, data: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse({ id, ...data });
    return apiClient.put(`/api/services/${id}/`, data);
  },
  delete: (id: number) => {
    if (DEMO_MODE) return mockResponse({ success: true });
    return apiClient.delete(`/api/services/${id}/`);
  },
};
