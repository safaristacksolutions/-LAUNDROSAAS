import api from "./client";
import type { User, Service, Customer, Order, DashboardData, RentHealth, StockItem, StockTransaction } from "../types";

export const auth = {
  login: (phone: string, password: string) =>
    api.post<{ user: User; access: string; refresh: string }>("/auth/login/", { phone, password }),
  refresh: (refresh: string) => api.post("/auth/refresh/", { refresh }),
  me: () => api.get<User>("/auth/me/"),
  register: (data: { phone: string; password: string; confirm_password: string; first_name: string; last_name: string; role: string }) =>
    api.post<{ user: User; access: string; refresh: string }>("/auth/register/", data),
  forgotPassword: (phone: string) =>
    api.post<{ message: string; code: string }>("/auth/forgot-password/", { phone }),
  resetPassword: (phone: string, code: string, new_password: string) =>
    api.post<{ message: string }>("/auth/reset-password/", { phone, code, new_password }),
};

export const services = {
  list: () => api.get<Service[]>("/services/"),
  create: (data: Partial<Service>) => api.post<Service>("/services/", data),
  update: (id: number, data: Partial<Service>) => api.patch<Service>(`/services/${id}/`, data),
  delete: (id: number) => api.delete(`/services/${id}/`),
};

export const customers = {
  list: (params?: any) => api.get<Customer[]>("/customers/", { params }),
  search: (phone: string) => api.get<Customer[]>("/customers/search/", { params: { phone } }),
  create: (data: Partial<Customer>) => api.post<Customer>("/customers/", data),
};

export const orders = {
  list: (params?: any) => api.get<Order[]>("/orders/", { params }),
  create: (data: any) => api.post<Order>("/orders/", data),
  get: (id: number) => api.get<Order>(`/orders/${id}/`),
  updateStatus: (id: number, status: string) =>
    api.post<Order>(`/orders/${id}/update_status/`, { status }),
  dashboard: () => api.get<DashboardData>("/orders/dashboard/"),
};

export const payments = {
  initiateSTK: (order_id: number, phone: string) =>
    api.post<{ checkout_request_id: string; status: string }>("/payments/mpesa/stk/", { order_id, phone }),
  status: (checkout_id: string) =>
    api.get<any>(`/payments/mpesa/status/${checkout_id}/`),
};

export const rent = {
  health: () => api.get<RentHealth>("/rent/reserve/health/"),
  addToReserve: (amount: number) =>
    api.post<RentHealth>("/rent/reserve/add_to_reserve/", { amount }),
};

export const inventory = {
  list: (params?: any) => api.get<StockItem[]>("/stock-items/", { params }),
  create: (data: Partial<StockItem>) => api.post<StockItem>("/stock-items/", data),
  update: (id: number, data: Partial<StockItem>) => api.patch<StockItem>(`/stock-items/${id}/`, data),
  delete: (id: number) => api.delete(`/stock-items/${id}/`),
  lowStock: () => api.get<StockItem[]>("/stock-items/low_stock/"),
  transactions: (params?: any) => api.get<StockTransaction[]>("/stock-transactions/", { params }),
};

export const analytics = {
  dashboard: () => api.get<any>("/analytics/dashboard/"),
  forecast: (days?: number) => api.get("/analytics/forecast/", { params: { days } }),
  peakHours: () => api.get("/analytics/peak_hours/"),
  serviceDemand: () => api.get("/analytics/service_demand/"),
  churn: () => api.get("/analytics/churn/"),
};

export const employees = {
  list: () => api.get<User[]>("/accounts/employees/"),
};
