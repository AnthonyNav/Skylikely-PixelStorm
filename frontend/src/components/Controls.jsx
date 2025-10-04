import { useAppStore } from "@store/useAppStore.js";
import { doyToDate } from "@lib/mapping.js";

export default function Controls() {
  const { lat, lon, doy, windowDays, thresholds, setDoy, setWindow, setThresholds } = useAppStore();
  const date = doyToDate(doy);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <div className="font-medium mb-1">Coordenadas</div>
        <div className="text-slate-600">Lat: {lat.toFixed(4)} Lon: {lon.toFixed(4)}</div>
      </div>

      <div>
        <label className="font-medium">Día del año: {doy} <span className="text-slate-500">({date.toLocaleDateString("es-MX")})</span></label>
        <input type="range" min="1" max="366" value={doy} onChange={(e)=>setDoy(parseInt(e.target.value))} className="w-full" />
      </div>

      <div>
        <label className="font-medium">Ventana ± días: {windowDays}</label>
        <input type="range" min="5" max="45" value={windowDays} onChange={(e)=>setWindow(parseInt(e.target.value))} className="w-full" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="font-medium">Muy caliente (°C): {thresholds.very_hot_C}</label>
          <input type="number" className="border rounded px-2 py-1 w-full"
                 value={thresholds.very_hot_C}
                 onChange={(e)=>setThresholds({ ...thresholds, very_hot_C: Number(e.target.value) })}/>
        </div>
        <div>
          <label className="font-medium">Muy húmedo (mm): {thresholds.very_wet_mm}</label>
          <input type="number" className="border rounded px-2 py-1 w-full"
                 value={thresholds.very_wet_mm}
                 onChange={(e)=>setThresholds({ ...thresholds, very_wet_mm: Number(e.target.value) })}/>
        </div>
        <div>
          <label className="font-medium">Muy ventoso (m/s): {thresholds.very_windy_ms}</label>
          <input type="number" className="border rounded px-2 py-1 w-full"
                 value={thresholds.very_windy_ms}
                 onChange={(e)=>setThresholds({ ...thresholds, very_windy_ms: Number(e.target.value) })}/>
        </div>
      </div>
    </div>
  );
}
