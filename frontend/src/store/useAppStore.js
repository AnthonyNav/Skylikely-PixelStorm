import { create } from "zustand";
export const useAppStore = create((set) => ({
  lat: 19.043, lon: -98.198, doy: 278, windowDays: 10,
  thresholds: { very_hot_C: 32, very_wet_mm: 10, very_windy_ms: 10 },
  data: null,
  setCoords: (lat, lon) => set({ lat, lon }),
  setDoy: (doy) => set({ doy }),
  setWindow: (windowDays) => set({ windowDays }),
  setThresholds: (t) => set({ thresholds: t }),
  setData: (data) => set({ data }),
}));
