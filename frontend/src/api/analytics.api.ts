import apiClient from "./axios";
import { DEMO_MODE } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const analyticsApi = {
  forecast: () => DEMO_MODE ? mockResponse({
    next_7_days: [
      { date: "2026-07-10", predicted: 6800, lower: 5200, upper: 8400 },
      { date: "2026-07-11", predicted: 7200, lower: 5600, upper: 8800 },
      { date: "2026-07-12", predicted: 6500, lower: 4900, upper: 8100 },
      { date: "2026-07-13", predicted: 7000, lower: 5400, upper: 8600 },
      { date: "2026-07-14", predicted: 7800, lower: 6200, upper: 9400 },
      { date: "2026-07-15", predicted: 7400, lower: 5800, upper: 9000 },
      { date: "2026-07-16", predicted: 8000, lower: 6400, upper: 9600 },
    ],
  }) : apiClient.get("/api/analytics/forecast/"),
  rfm: () => DEMO_MODE ? mockResponse({
    segments: [
      { name: "Champions", count: 12, revenue: 18400 },
      { name: "Loyal", count: 25, revenue: 22800 },
      { name: "Potential", count: 18, revenue: 9600 },
      { name: "New", count: 22, revenue: 7200 },
      { name: "At Risk", count: 8, revenue: 3200 },
      { name: "Lost", count: 4, revenue: 800 },
    ],
  }) : apiClient.get("/api/analytics/rfm/"),
};
