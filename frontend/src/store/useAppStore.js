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

  // Area selection states
  selectionMode: null, // 'circle' | 'pen' | null
  selectionShape: null, // GeoJSON Polygon
  selectionCenter: null, // [lng, lat]
  radiusKm: 10, // Default radius for circle mode
  isDrawing: false,
  drawingPoints: [], // Temporary points while drawing

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

  // Area selection actions
  setSelectionMode: (mode) => set({ selectionMode: mode, isDrawing: mode !== null, drawingPoints: [] }),
  setRadiusKm: (radius) => set({ radiusKm: Math.min(radius, 22.5) }), // Limit to 22.5km
  addDrawingPoint: (point) => set((state) => {
    const newPoints = [...state.drawingPoints, point];
    return { drawingPoints: newPoints };
  }),
  clearDrawing: () => set({ 
    isDrawing: false, 
    drawingPoints: [], 
    selectionMode: null, 
    selectionShape: null, 
    selectionCenter: null 
  }),
  completeSelection: (shape, center) => set({ 
    selectionShape: shape, 
    selectionCenter: center, 
    isDrawing: false, 
    selectionMode: null,
    drawingPoints: [],
    lat: center[1], // Update coordinates to center
    lon: center[0]
  }),

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
