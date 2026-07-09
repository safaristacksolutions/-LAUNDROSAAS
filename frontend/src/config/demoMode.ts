export const DEMO_MODE = true;

export const MOCK_USER = {
  id: 1,
  username: "demo",
  email: "safaristacksolutions@gmail.com",
  phone: "0741281539",
  full_name: "Safaristack Solutions",
  role: "admin" as const,
  permissions: ["all"],
  is_onboarded: true,
};

export const MOCK_TENANT = {
  id: 1,
  name: "Safaristack Solutions",
  slug: "safaristack",
  logo_url: "",
  primary_color: "#4F46E5",
  secondary_color: "#0EA5E9",
  currency: "KES",
  tax_rate: 16,
  plan: "pro" as const,
};

export const MOCK_BRANCHES = [
  { id: 1, name: "Main Branch", slug: "main", address: "123 Moi Avenue, Nairobi", phone: "+254712345678", is_main: true },
  { id: 2, name: "Westlands", slug: "westlands", address: "456 Westlands, Nairobi", phone: "+254798765432", is_main: false },
];

export const MOCK_SERVICES = [
  { id: 1, name: "Wash & Fold", unit: "kg" as const, price: 150, is_active: true },
  { id: 2, name: "Wash & Iron", unit: "kg" as const, price: 250, is_active: true },
  { id: 3, name: "Dry Cleaning", unit: "item" as const, price: 400, is_active: true },
  { id: 4, name: "Iron Only", unit: "item" as const, price: 100, is_active: true },
  { id: 5, name: "Duvet", unit: "item" as const, price: 600, is_active: true },
  { id: 6, name: "Full Service", unit: "kg" as const, price: 350, is_active: true },
];

export const MOCK_CUSTOMERS = [
  { id: 1, full_name: "Jane Wanjiku", phone: "0712345678", email: "jane@example.com", address: "Nairobi", created_at: new Date().toISOString() },
  { id: 2, full_name: "Peter Kamau", phone: "0723456789", email: "peter@example.com", address: "Kiambu", created_at: new Date().toISOString() },
  { id: 3, full_name: "Mary Akinyi", phone: "0734567890", email: "mary@example.com", address: "Mombasa", created_at: new Date().toISOString() },
  { id: 4, full_name: "David Otieno", phone: "0745678901", email: "david@example.com", address: "Kisumu", created_at: new Date().toISOString() },
  { id: 5, full_name: "Grace Njeri", phone: "0756789012", email: "grace@example.com", address: "Nakuru", created_at: new Date().toISOString() },
];

export const MOCK_ORDERS = [
  { id: 1, order_number: "ORD-2401", customer: 1, customer_name: "Jane Wanjiku", cashier: 1, cashier_name: "Safaristack Solutions", status: "ready", subtotal: 450, discount: 0, tax: 72, total: 522, pickup_date: null, delivery_date: new Date(Date.now() + 86400000).toISOString(), items: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, order_number: "ORD-2400", customer: 2, customer_name: "Peter Kamau", cashier: 1, cashier_name: "Safaristack Solutions", status: "washing", subtotal: 280, discount: 0, tax: 44.8, total: 324.8, pickup_date: null, delivery_date: new Date(Date.now() + 172800000).toISOString(), items: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, order_number: "ORD-2399", customer: 3, customer_name: "Mary Akinyi", cashier: 1, cashier_name: "Safaristack Solutions", status: "ironing", subtotal: 620, discount: 50, tax: 91.2, total: 661.2, pickup_date: null, delivery_date: new Date(Date.now() + 259200000).toISOString(), items: [], created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: 4, order_number: "ORD-2398", customer: 4, customer_name: "David Otieno", cashier: 1, cashier_name: "Safaristack Solutions", status: "delivered", subtotal: 350, discount: 0, tax: 56, total: 406, pickup_date: null, delivery_date: new Date().toISOString(), items: [], created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString() },
  { id: 5, order_number: "ORD-2397", customer: 5, customer_name: "Grace Njeri", cashier: 1, cashier_name: "Safaristack Solutions", status: "received", subtotal: 180, discount: 0, tax: 28.8, total: 208.8, pickup_date: null, delivery_date: new Date(Date.now() + 86400000).toISOString(), items: [], created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString() },
];

export const MOCK_DASHBOARD = {
  orders_today: 12,
  total_revenue: 45200,
  cash: 18200,
  mpesa: 27000,
  overdue_pickups: 3,
  pending_payments: 5,
};
