import { reportApi } from "../../../api/report.api";
import apiClient from "../../../api/axios";
import { DEMO_MODE, MOCK_DASHBOARD } from "../../../config/demoMode";
import { mockResponse } from "../../../config/mockResponse";

export const dashboardApi = {
  getStats: () => DEMO_MODE ? mockResponse(MOCK_DASHBOARD) : apiClient.get("/api/dashboard/"),
  getRentHealth: () => DEMO_MODE ? mockResponse({ status: "paid", message: "Demo", reserve_amount: 100000, monthly_rent: 50000, days_until_due: 25, projected: null, reserve_percent: 200 }) : apiClient.get("/api/dashboard/rent-health/"),
  getSales: (params?: Record<string, unknown>) => DEMO_MODE ? mockResponse({ total_revenue: 45200, orders: 12, items: [] }) : reportApi.sales(params),
};
