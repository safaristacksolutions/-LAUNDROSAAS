import apiClient from "./axios";

export const settingsApi = {
  getGeneral: () => apiClient.get("/api/settings/general/"),
  updateGeneral: (data: Record<string, unknown>) =>
    apiClient.put("/api/settings/general/", data),
  getPayment: () => apiClient.get("/api/settings/payment/"),
  updatePayment: (data: Record<string, unknown>) =>
    apiClient.put("/api/settings/payment/", data),
  getNotifications: () => apiClient.get("/api/settings/notifications/"),
  updateNotifications: (data: Record<string, unknown>) =>
    apiClient.put("/api/settings/notifications/", data),
  getBranding: () => apiClient.get("/api/settings/branding/"),
  updateBranding: (data: Record<string, unknown>) =>
    apiClient.put("/api/settings/branding/", data),
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);
    return apiClient.post("/api/settings/branding/upload-logo/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getIntegrations: () => apiClient.get("/api/settings/integrations/"),
  updateIntegrations: (data: Record<string, unknown>) =>
    apiClient.put("/api/settings/integrations/", data),
  testMpesa: (data: Record<string, unknown>) =>
    apiClient.post("/api/settings/payment/test-mpesa/", data),
};
