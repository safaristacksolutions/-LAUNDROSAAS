import apiClient from "../../../api/axios";

export const dashboardApi = {
  getStats: () => apiClient.get("/api/dashboard/"),
  getRentHealth: () => apiClient.get("/api/dashboard/rent-health/"),
};
