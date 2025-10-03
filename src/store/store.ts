// store.ts
import { create } from "zustand";

interface ProjectState {
  name: string;
  description: string;
  branchName: string;
  step: number; // برای مدیریت مراحل
  setProject: (data: {
    name: string;
    description: string;
    branchName: string;
  }) => void;
  nextStep: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  name: "",
  description: "",
  branchName: "",
  step: 1,
  setProject: (data) => set((state) => ({ ...state, ...data })),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
}));
