import { create } from "zustand";
import type { User } from "../types";
import { authApi } from "../api/auth.api";

interface AuthState {
  user: User | null;
  token: string | null;
  activeBranchId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (fullName: string, phone: string, email: string, password: string, address?: string) => Promise<void>;
  setToken: (token: string) => void;
  setBranch: (id: number) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  activeBranchId: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (phone, password) => {
    const { data } = await authApi.login(phone, password);
    set({
      token: data.access,
      user: data.user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (fullName, phone, email, password, address) => {
    await authApi.register({ full_name: fullName, phone, email, password, address });
  },

  setToken: (token) => set({ token }),

  setBranch: (id) => set({ activeBranchId: id }),
  setLoading: (v) => set({ isLoading: v }),

  logout: () => {
    set({
      user: null,
      token: null,
      activeBranchId: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadUser: async () => {
    try {
      const { data } = await authApi.me();
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clear: () => {
    set({
      user: null,
      token: null,
      activeBranchId: null,
      isAuthenticated: false,
      isLoading: true,
    });
  },
}));
