import api from "./client";
import type { User, Service, Customer, Order, DashboardData, RentHealth } from "../types";

export const auth = {
  login: (phone: string, password: string) =>
    api.post<{ user: User; access: string; refresh: string }>("/auth/login/", { phone, password }),
  refresh: (refresh: string) => api.post("/auth/refresh/", { refresh }),
  me: () => api.get<User>("/auth/me/"),
  register: (data: { phone: string; password: string; confirm_password: string; first_name: string; last_name: string; role: string }) =>
    api.post<{ user: User; access: string; refresh: string }>("/auth/register/", data),
};

export const services = {
  list: () => api.get<Service[]>("/services/"),
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
