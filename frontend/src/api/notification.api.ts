import apiClient from "./axios";

export const notificationApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/api/notifications/", { params }),
  get: (id: number) =>
    apiClient.get(`/api/notifications/${id}/`),
  markAsRead: (id: number) =>
    apiClient.post(`/api/notifications/${id}/mark-read/`),
  markAllAsRead: () =>
    apiClient.post("/api/notifications/mark-all-read/"),
  delete: (id: number) =>
    apiClient.delete(`/api/notifications/${id}/`),
  getUnreadCount: () =>
    apiClient.get("/api/notifications/unread-count/"),
  getPreferences: () =>
    apiClient.get("/api/notifications/preferences/"),
  updatePreferences: (data: Record<string, unknown>) =>
    apiClient.put("/api/notifications/preferences/", data),
};
