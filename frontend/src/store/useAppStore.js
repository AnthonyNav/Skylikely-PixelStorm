import { create } from "zustand";
import { dateISOToDoy } from "@lib/mapping.js";
import { fetchSample } from "@lib/fetchLocal.js";

export const useAppStore = create((set, get) => ({
  lat: 19.4326,
  lon: -99.1332,
  date_of_interest: "2023-07-15",
  engine: "logistic",
  window_days: 7,
  spatial_mode: "nearest",
  area_km: 25,
  // Map mode: 2d | 3d
  mapMode: "2d",

  panelVisible: true,
  thresholds: { very_hot_C: 32, very_wet_mm: 10, very_windy_ms: 10 },

  data: null, loading: false, error: null,

  setMapMode: (m) => set({ mapMode: m }),
  togglePanel: () => set((state) => ({ panelVisible: !state.panelVisible })),
  setCoords: (lat, lon) => set({ lat, lon }),
  setDate: (date) => set({ date_of_interest: date }),
  setEngine: (engine) => set({ engine }),
  setWindow: (n) => set({ window_days: n }),
  setSpatialMode: (m) => set({ spatial_mode: m }),
  setAreaKm: (v) => set({ area_km: v }),
  setThresholds: (t) => set({ thresholds: t }),
  setData: (d) => set({ data: d }),

  calculate: async () => {
    const s = get();
    set({ loading: true, error: null });
    try {
      const doy = dateISOToDoy(s.date_of_interest);
      // convención: <ciudad>_doyNNN.json (ajusta el prefijo si quieres)
      const path = `/data/samples/texas_doy${String(doy).padStart(3, "0")}.json`;
      const json = await fetchSample(path);
      set({ data: json, loading: false });
    } catch {
      set({ loading: false, error: "No hay JSON de prueba para esa fecha." });
    }
  },
}));

