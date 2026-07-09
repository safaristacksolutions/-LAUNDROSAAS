import apiClient from "./axios";
import { DEMO_MODE } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const employeeApi = {
  list: () => DEMO_MODE ? mockResponse([
    { id: 1, full_name: "John Mwangi", phone: "0711111111", email: "john@example.com", role: "employee" },
    { id: 2, full_name: "Sarah Wanjiku", phone: "0722222222", email: "sarah@example.com", role: "cashier" },
    { id: 3, full_name: "Kevin Otieno", phone: "0733333333", email: "kevin@example.com", role: "employee" },
  ]) : apiClient.get("/api/employees/"),
  create: (data: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse({ id: Date.now(), ...data });
    return apiClient.post("/api/employees/", data);
  },
};
