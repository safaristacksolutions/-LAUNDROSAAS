import { orderApi } from "../../../api/order.api";

export const laundryApi = {
  list: (params?: Record<string, unknown>) =>
    orderApi.list({ status: "received,sorting,washing,drying,ironing,packaging", ...params }),
  updateStatus: (id: number, status: string) =>
    orderApi.updateStatus(id, status),
};
