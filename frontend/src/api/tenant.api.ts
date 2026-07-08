import apiClient from "./axios";

export const tenantApi = {
  config: () => apiClient.get("/api/tenant-config/"),
  branches: () => apiClient.get("/api/branches/"),
};
