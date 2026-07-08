import apiClient from "../../../api/axios";

export const inventoryApi = {
  list: () => apiClient.get("/api/inventory/"),
};
