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
  postalCode: string;
}

export interface LocationData {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

interface ProjectState {
  name: string;
  description: string;
  branchName: string;
  phone: string;
  area: number;
  manager: {
    firstName: string;
    lastName: string;
    mobile: string;
    nationalCode: string;
  };
  address: AddressData;
  location: LocationData;
  step: number;
  setProject: (
    data: Partial<{
      name: string;
      description: string;
      branchName: string;
      phone: string;
      area: number;
    }>
  ) => void;
  setManager: (data: ProjectState["manager"]) => void;
  setAddress: (data: AddressData) => void;
  setLocation: (data: LocationData) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStore: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  name: "",
  description: "",
  branchName: "",
  phone: "",
  area: 0,
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
    postalCode: "",
  },
  location: {
    type: "Point",
    coordinates: [51.389, 35.6892], // تهران به عنوان موقعیت پیش‌فرض
  },
  step: 1,
  setProject: (data) => set((state) => ({ ...state, ...data })),
  setManager: (data) => set((state) => ({ ...state, manager: data })),
  setAddress: (data) => set((state) => ({ ...state, address: data })),
  setLocation: (data) => set((state) => ({ ...state, location: data })),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  resetStore: () =>
    set({
      name: "",
      description: "",
      branchName: "",
      phone: "",
      area: 0,
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
        postalCode: "",
      },
      location: {
        type: "Point",
        coordinates: [51.389, 35.6892],
      },
      step: 1,
    }),
}));
