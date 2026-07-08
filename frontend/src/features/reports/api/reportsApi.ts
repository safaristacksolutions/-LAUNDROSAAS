import apiClient from "../../../api/axios";

export const reportsApi = {
  sales: (params?: Record<string, unknown>) => apiClient.get("/api/reports/sales/", { params }),
};
