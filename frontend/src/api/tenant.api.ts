import apiClient from "./axios";

export const tenantApi = {
  config: () => apiClient.get("/api/tenant-config/"),
  list: () => apiClient.get("/api/tenants/"),
  provision: (data: Record<string, unknown>) =>
    apiClient.post("/api/tenants/provision/", data),
  branches: () => apiClient.get("/api/branches/"),
};
