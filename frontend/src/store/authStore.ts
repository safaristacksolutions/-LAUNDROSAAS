import { create } from "zustand";
import type { User } from "../types";
import { authApi } from "../api/auth.api";
import { DEMO_MODE, MOCK_USER } from "../config/demoMode";

interface AuthState {
  user: User | null;
  token: string | null;
  activeBranchId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (fullName: string, phone: string, email: string, password: string, address?: string) => Promise<void>;
  setToken: (token: string) => void;
  setBranch: (id: number) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  clear: () => void;
}

function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 400));
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  activeBranchId: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (phone, password) => {
    if (DEMO_MODE) {
      await mockDelay();
      set({
        token: "demo-token-123",
        user: MOCK_USER,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }
    const { data } = await authApi.login(phone, password);
    set({
      token: data.access,
      user: data.user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  demoLogin: async () => {
    await mockDelay();
    set({
      token: "demo-token-123",
      user: MOCK_USER,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (fullName, phone, email, password, address) => {
    if (DEMO_MODE) {
      await mockDelay();
      return;
    }
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
    if (DEMO_MODE) {
      await mockDelay();
      set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
      return;
    }
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
