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
  thresholds: { very_hot_C: 32, very_wet_mm: 10, very_windy_ms: 10 },

  data: null, loading: false, error: null,

  setCoords: (lat, lon) => set({ lat, lon }),
  setDate: (date) => set({ date_of_interest: date }),
  setEngine: (engine) => set({ engine }),
  setWindow: (n) => set({ window_days: n }),
  setSpatialMode: (m) => set({ spatial_mode: m }),
  setAreaKm: (v) => set({ area_km: v }),
  setThresholds: (t) => set({ thresholds: t }),
  setData: (d) => set({ data: d }),

  calculate: async () => {
    set({ loading: true, error: null });
    const { date_of_interest } = get();
    try {
      const doy = dateISOToDoy(date_of_interest);
      const json = await fetchSample(`/data/samples/puebla_doy${doy}.json`);
      set({ data: json, loading: false });
    } catch {
      set({ loading: false, error: "No hay datos para esa fecha. Carga de ejemplo fallida." });
    }
  },
}));
