import { create } from "zustand";
import type { Branch } from "../types";

interface BranchState {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  branches: [],
  setBranches: (branches) => set({ branches }),
}));
