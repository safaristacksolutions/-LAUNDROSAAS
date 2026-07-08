import apiClient from "../../../api/axios";

export const posApi = {
  searchCustomers: (phone: string) =>
    apiClient.get("/api/customers/", { params: { search: phone } }),

  getServices: () =>
    apiClient.get("/api/services/"),

  createOrder: (data: Record<string, unknown>) =>
    apiClient.post("/api/orders/", data),

  initiateSTK: (orderId: number, phone: string) =>
    apiClient.post("/api/payments/mpesa/stk/", { order_id: orderId, phone }),

  checkPayment: (checkoutId: string) =>
    apiClient.get(`/api/payments/mpesa/status/${checkoutId}/`),
};
