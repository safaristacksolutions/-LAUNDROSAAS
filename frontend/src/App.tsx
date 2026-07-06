import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { AppLayout } from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import POSScreen from "./pages/pos/POSScreen";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeTaskQueue from "./pages/employee/EmployeeTaskQueue";
import CustomerTracker from "./pages/customer/CustomerTracker";
import SuperAdminPanel from "./pages/superadmin/SuperAdminPanel";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import ServicesPage from "./pages/ServicesPage";
import EmployeesPage from "./pages/EmployeesPage";
import ReportsPage from "./pages/ReportsPage";
import InventoryPage from "./pages/InventoryPage";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: "admin" | "cashier" | "employee" | "superadmin" }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role && user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/pos" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="admin">{children}</ProtectedRoute>;
}

function CashierRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="cashier">{children}</ProtectedRoute>;
}

function EmployeeRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="employee">{children}</ProtectedRoute>;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/pos" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/pos" />} />
      <Route path="/track/:orderId" element={<CustomerTracker />} />

      {/* App Layout with Sidebar */}
      <Route element={<AppLayout />}>
        {/* Cashier routes */}
        <Route path="/pos" element={<CashierRoute><POSScreen /></CashierRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/orders" element={<AdminRoute><OrdersPage /></AdminRoute>} />
        <Route path="/customers" element={<AdminRoute><CustomersPage /></AdminRoute>} />
        <Route path="/services" element={<AdminRoute><ServicesPage /></AdminRoute>} />
        <Route path="/inventory" element={<AdminRoute><InventoryPage /></AdminRoute>} />
        <Route path="/employees" element={<AdminRoute><EmployeesPage /></AdminRoute>} />
        <Route path="/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />

        {/* Employee routes */}
        <Route path="/employee" element={<EmployeeRoute><EmployeeTaskQueue /></EmployeeRoute>} />

        {/* SuperAdmin routes */}
        <Route path="/superadmin" element={<AdminRoute><SuperAdminPanel /></AdminRoute>} />
      </Route>
    </Routes>
  );
}
