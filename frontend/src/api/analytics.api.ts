import apiClient from "./axios";

export const analyticsApi = {
  forecast: () => apiClient.get("/api/analytics/forecast/"),
  rfm: () => apiClient.get("/api/analytics/rfm/"),
};
