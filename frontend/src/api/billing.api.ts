import apiClient from "./axios";
import { DEMO_MODE } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const billingApi = {
  subscriptions: () => DEMO_MODE ? mockResponse({
    plan: "Pro",
    status: "active",
    next_billing: "2026-08-01",
    amount: 4999,
    features: ["Unlimited orders", "Multi-branch", "Analytics", "Staff management", "M-Pesa integration"],
  }) : apiClient.get("/api/billing/subscriptions/"),
  invoices: () => DEMO_MODE ? mockResponse([
    { id: 1, number: "INV-001", date: "2026-06-01", amount: 4999, status: "paid" },
    { id: 2, number: "INV-002", date: "2026-07-01", amount: 4999, status: "paid" },
  ]) : apiClient.get("/api/billing/invoices/"),
};
