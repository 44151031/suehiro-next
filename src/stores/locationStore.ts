import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  lat: number | null;
  lng: number | null;
  fetched: boolean;
  setLocation: (lat: number, lng: number) => void;
  resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      fetched: false,
      setLocation: (lat, lng) => set({ lat, lng, fetched: true }),
      resetLocation: () => set({ lat: null, lng: null, fetched: false }),
    }),
    {
      name: "location-storage", // localStorage のキー名
    }
  )
);
