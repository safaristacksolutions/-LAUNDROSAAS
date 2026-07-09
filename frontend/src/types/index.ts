export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  full_name: string;
  role: "admin" | "cashier" | "employee" | "superadmin";
  permissions: string[];
  is_onboarded: boolean;
}

export interface TenantConfig {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  currency: string;
  tax_rate: number;
  plan: "starter" | "pro" | "enterprise";
}

export interface Branch {
  id: number;
  name: string;
  slug: string;
  address: string;
  phone: string;
  is_main: boolean;
}

export interface Service {
  id: number;
  name: string;
  unit: "kg" | "item" | "flat";
  price: number;
  is_active: boolean;
}

export interface Customer {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface OrderItem {
  id?: number;
  service: number;
  service_name?: string;
  quantity: number | null;
  weight_kg: number | null;
  unit_price: number;
  line_total: number;
}

export type OrderStatus =
  | "received" | "washing" | "drying" | "ironing" | "ready" | "delivered";

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  customer_name?: string;
  cashier: number;
  cashier_name?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  pickup_date: string | null;
  delivery_date: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order: number;
  method: "cash" | "mpesa" | "card";
  amount: number;
  reference: string;
  paid_at: string;
}

export interface DashboardData {
  orders_today: number;
  total_revenue: number;
  cash: number;
  mpesa: number;
  overdue_pickups: number;
  pending_payments: number;
}

export interface RentHealth {
  status: "paid" | "safe" | "warning" | "critical" | "not_setup";
  message: string;
  reserve_amount: number;
  monthly_rent: number;
  days_until_due: number;
  projected: number | null;
  reserve_percent: number;
}

export interface StockItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  min_stock: number;
  price_per_unit: string;
  supplier: string;
}

export interface WorkflowStage {
  name: string;
  label: string;
  timestamp: string | null;
  by: string | null;
  status: "done" | "active" | "pending";
}
