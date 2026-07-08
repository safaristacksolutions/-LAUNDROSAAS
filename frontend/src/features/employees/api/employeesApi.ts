import apiClient from "../../../api/axios";

export const employeesApi = {
  list: () => apiClient.get("/api/employees/"),
};
