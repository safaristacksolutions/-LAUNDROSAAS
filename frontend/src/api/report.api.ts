import apiClient from "./axios";

export const reportApi = {
  sales: (params?: Record<string, unknown>) =>
    apiClient.get("/api/reports/sales/", { params }),
  export: (params?: Record<string, unknown>) =>
    apiClient.get("/api/reports/export/", {
      params, responseType: "blob",
    }),
};
