import apiClient from "../../../api/axios";

export const customersApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/api/customers/", { params }),
};
