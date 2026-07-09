import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { TenantGate } from "../app/TenantGate";

const LoginPage = lazy(() => import("../features/authentication/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/authentication/pages/RegisterPage"));
const POSScreen = lazy(() => import("../features/pos/pages/POSScreen"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const OrdersPage = lazy(() => import("../features/orders/pages/OrdersPage"));
const CustomersPage = lazy(() => import("../features/customers/pages/CustomersPage"));
const LaundryPage = lazy(() => import("../features/laundry/pages/LaundryPage"));
const InventoryPage = lazy(() => import("../features/inventory/pages/InventoryPage"));
const EmployeesPage = lazy(() => import("../features/employees/pages/EmployeesPage"));
const ReportsPage = lazy(() => import("../features/reports/pages/ReportsPage"));
const BillingPage = lazy(() => import("../features/billing/pages/BillingPage"));
const AnalyticsPage = lazy(() => import("../features/analytics/pages/AnalyticsPage"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
  {
    path: "/",
    element: <TenantGate />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/pos" replace /> },
          { path: "pos", element: <POSScreen /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "customers", element: <CustomersPage /> },
          { path: "laundry", element: <LaundryPage /> },
          { path: "inventory", element: <InventoryPage /> },
          { path: "employees", element: <EmployeesPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "billing", element: <BillingPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
        ],
      },
    ],
  },
]);
