import { create } from "zustand";

interface ThemeState {
  mode: "light" | "dark";
  toggleMode: () => void;
  setMode: (mode: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  toggleMode: () => set((s) => ({ mode: s.mode === "light" ? "dark" : "light" })),
  setMode: (mode) => set({ mode }),
}));
