import apiClient from "./axios";

export const billingApi = {
  subscriptions: () => apiClient.get("/api/billing/subscriptions/"),
  invoices: () => apiClient.get("/api/billing/invoices/"),
};
