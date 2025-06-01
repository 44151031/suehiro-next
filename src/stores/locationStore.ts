// ✅ /stores/locationStore.ts
import { create } from "zustand";

type LocationState = {
  lat: number | null;
  lng: number | null;
  fetched: boolean;
  setLocation: (lat: number, lng: number) => void;
  resetLocation: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lng: null,
  fetched: false,
  setLocation: (lat, lng) => set({ lat, lng, fetched: true }),
  resetLocation: () => set({ lat: null, lng: null, fetched: false }),
}));
