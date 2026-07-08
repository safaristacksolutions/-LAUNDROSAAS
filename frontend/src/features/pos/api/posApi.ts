import { customerApi } from "../../../api/customer.api";
import { serviceApi } from "../../../api/service.api";
import { orderApi } from "../../../api/order.api";
import { paymentApi } from "../../../api/payment.api";

export const posApi = {
  searchCustomers: (phone: string) =>
    customerApi.list({ search: phone }),
  getServices: () =>
    serviceApi.list(),
  createOrder: (data: Record<string, unknown>) =>
    orderApi.create(data),
  initiateSTK: (orderId: number, phone: string, amount: number) =>
    paymentApi.stkPush(orderId, phone, amount),
  checkPayment: (checkoutId: string) =>
    paymentApi.status(checkoutId),
};
