import { reportApi } from "../../../api/report.api";
import apiClient from "../../../api/axios";

export const dashboardApi = {
  getStats: () => apiClient.get("/api/dashboard/"),
  getRentHealth: () => apiClient.get("/api/dashboard/rent-health/"),
  getSales: (params?: Record<string, unknown>) => reportApi.sales(params),
};
