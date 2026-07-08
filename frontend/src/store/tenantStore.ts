import { create } from "zustand";
import type { TenantConfig } from "../types";

interface TenantState {
  config: TenantConfig | null;
  isHydrated: boolean;
  setConfig: (config: TenantConfig) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  config: null,
  isHydrated: false,
  setConfig: (config) => set({ config, isHydrated: true }),
}));
