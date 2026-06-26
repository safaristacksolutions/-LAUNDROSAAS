import { create } from "zustand";
import type { User } from "../types";
import { auth as authApi } from "../api/endpoints";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: { phone: string; password: string; confirm_password: string; first_name: string; last_name: string; role: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,

  login: async (phone, password) => {
    const { data } = await authApi.login(phone, password);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    set({ user: data.user, token: data.access, isAuthenticated: true });
  },

  register: async (data) => {
    const { data: res } = await authApi.register(data);
    localStorage.setItem("access_token", res.access);
    localStorage.setItem("refresh_token", res.refresh);
    set({ user: res.user, token: res.access, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const { data } = await authApi.me();
      set({ user: data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
