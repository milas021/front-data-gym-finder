// store.ts
import { create } from "zustand";

interface AddressData {
  province: number;
  city: number;
  neighborhood: number;
  mainStreet: string;
  street: string;
  alley: string;
  flat: string;
  fullAddress: string;
}

interface ProjectState {
  name: string;
  description: string;
  branchName: string;
  manager: {
    firstName: string;
    lastName: string;
    mobile: string;
    nationalCode: string;
  };
  address: AddressData;
  step: number;
  setProject: (
    data: Partial<{
      name: string;
      description: string;
      branchName: string;
    }>
  ) => void;
  setManager: (data: ProjectState["manager"]) => void;
  setAddress: (data: AddressData) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  name: "",
  description: "",
  branchName: "",
  manager: {
    firstName: "",
    lastName: "",
    mobile: "",
    nationalCode: "",
  },
  address: {
    province: 1,
    city: 1,
    neighborhood: 1,
    mainStreet: "",
    street: "",
    alley: "",
    flat: "",
    fullAddress: "",
  },
  step: 1,
  setProject: (data) => set((state) => ({ ...state, ...data })),
  setManager: (data) => set((state) => ({ ...state, manager: data })),
  setAddress: (data) => set((state) => ({ ...state, address: data })),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
}));
