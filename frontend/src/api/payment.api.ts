import apiClient from "./axios";
import { DEMO_MODE } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

let demoCheckoutId = 1;

export const paymentApi = {
  stkPush: (orderId: number, phone: string, amount: number) => {
    if (DEMO_MODE) return mockResponse({
      CheckoutRequestID: `demo-${demoCheckoutId++}`,
      ResponseCode: "0",
      ResponseDescription: "Success. Demo STK push sent.",
      CustomerMessage: "STK push sent to your phone",
    });
    return apiClient.post("/api/payments/mpesa/stk/", { order_id: orderId, phone, amount });
  },
  callback: (data: Record<string, unknown>) => DEMO_MODE ? mockResponse({ ResultCode: 0, ResultDesc: "Success" }) : apiClient.post("/api/payments/mpesa/callback/", data),
  status: (checkoutId: string) => {
    if (DEMO_MODE) {
      if (demoCheckoutId > 3) return mockResponse({ ResultCode: "0", ResultDesc: "The service request is processed successfully.", paid: true });
      demoCheckoutId++;
      return mockResponse({ ResultCode: "1", ResultDesc: "The balance is insufficient for the transaction.", paid: false });
    }
    return apiClient.get(`/api/payments/mpesa/status/${checkoutId}/`);
  },
};
