import apiClient from "./axios";

export const employeeApi = {
  list: () => apiClient.get("/api/employees/"),
  create: (data: Record<string, unknown>) =>
    apiClient.post("/api/employees/", data),
};
