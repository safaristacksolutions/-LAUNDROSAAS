import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import LandingPage from "./pages/LandingPage";
import POSScreen from "./pages/pos/POSScreen";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeTaskQueue from "./pages/employee/EmployeeTaskQueue";
import CustomerTracker from "./pages/customer/CustomerTracker";
import SuperAdminPanel from "./pages/superadmin/SuperAdminPanel";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role && user?.role !== "admin") {
    return <Navigate to="/pos" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/pos" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/pos" />} />

      <Route path="/pos" element={
        <ProtectedRoute role="cashier">
          <POSScreen />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/employee" element={
        <ProtectedRoute role="employee">
          <EmployeeTaskQueue />
        </ProtectedRoute>
      } />

      <Route path="/track/:orderId" element={<CustomerTracker />} />

      <Route path="/superadmin" element={
        <ProtectedRoute role="admin">
          <SuperAdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
