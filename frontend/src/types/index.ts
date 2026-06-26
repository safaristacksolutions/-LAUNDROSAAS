export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: "admin" | "cashier" | "employee";
  is_onboarded: boolean;
}

export interface Service {
  id: number;
  name: string;
  icon: string;
  price_kes: string;
  unit: "kg" | "item";
  is_active: boolean;
}

export interface Customer {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  total_orders: number;
  total_spent_kes: string;
  last_order_at: string | null;
  is_loyalty: boolean;
}

export interface OrderItem {
  id?: number;
  service: number;
  service_name?: string;
  service_icon?: string;
  quantity_kg?: number | null;
  quantity_items?: number | null;
  line_total_kes: number;
}

export interface OrderItemCount {
  shirts: number;
  trousers: number;
  dresses: number;
  bedsheets: number;
  jackets: number;
  other: number;
  total_items: number;
  photo?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  customer_name: string;
  created_by: number;
  created_by_name: string;
  status: OrderStatus;
  subtotal_kes: string;
  vat_kes: string;
  total_kes: string;
  payment_method: "cash" | "mpesa" | "card";
  expected_ready_at: string;
  picked_up_at: string | null;
  delivery_notes: string;
  is_paid: boolean;
  items: OrderItem[];
  item_count?: OrderItemCount;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "received"
  | "washing"
  | "drying"
  | "ironing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Payment {
  id: number;
  order: number;
  method: "cash" | "mpesa" | "stripe";
  amount: string;
  state: PaymentState;
  mpesa_receipt: string;
  paid_at: string | null;
}

export type PaymentState =
  | "initiated"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface RentHealth {
  status: "paid" | "safe" | "warning" | "critical" | "not_setup";
  message: string;
  reserve_amount: number;
  monthly_rent: number;
  days_until_due: number;
  projected: number | null;
  reserve_percent: number;
}

export interface DashboardData {
  orders_today: number;
  total_revenue: number;
  cash: number;
  mpesa: number;
  overdue_pickups: number;
  pending_payments: number;
}

export interface CartItem {
  service: Service;
  quantity_kg?: number;
  quantity_items?: number;
  line_total: number;
}
