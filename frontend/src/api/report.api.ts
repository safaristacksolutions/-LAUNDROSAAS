import apiClient from "./axios";
import { DEMO_MODE } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const reportApi = {
  sales: (params?: Record<string, unknown>) => DEMO_MODE ? mockResponse({
    total_revenue: 45200,
    total_orders: 89,
    avg_order_value: 508,
    daily: [
      { date: "2026-07-03", revenue: 6200, orders: 12 },
      { date: "2026-07-04", revenue: 5800, orders: 10 },
      { date: "2026-07-05", revenue: 7100, orders: 14 },
      { date: "2026-07-06", revenue: 4900, orders: 9 },
      { date: "2026-07-07", revenue: 8300, orders: 16 },
      { date: "2026-07-08", revenue: 6700, orders: 13 },
      { date: "2026-07-09", revenue: 6200, orders: 15 },
    ],
  }) : apiClient.get("/api/reports/sales/", { params }),
  export: (params?: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse(new Blob(["demo,csv,data"], { type: "text/csv" }));
    return apiClient.get("/api/reports/export/", { params, responseType: "blob" });
  },
};
