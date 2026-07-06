import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    loadUser: store.loadUser,
    isAdmin: store.user?.role === "admin",
    isCashier: store.user?.role === "cashier",
    isEmployee: store.user?.role === "employee",
    isSuperAdmin: false,
  };
}
