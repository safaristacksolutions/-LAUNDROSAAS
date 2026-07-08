import apiClient from "./axios";

export const paymentApi = {
  stkPush: (orderId: number, phone: string, amount: number) =>
    apiClient.post("/api/payments/mpesa/stk/", {
      order_id: orderId, phone, amount,
    }),
  callback: (data: Record<string, unknown>) =>
    apiClient.post("/api/payments/mpesa/callback/", data),
  status: (checkoutId: string) =>
    apiClient.get(`/api/payments/mpesa/status/${checkoutId}/`),
};
