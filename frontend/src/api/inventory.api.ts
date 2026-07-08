import apiClient from "./axios";

export const inventoryApi = {
  list: () => apiClient.get("/api/inventory/"),
  stockIn: (data: Record<string, unknown>) =>
    apiClient.post("/api/inventory/stock-in/", data),
};
