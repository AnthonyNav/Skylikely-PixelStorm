import { useAppStore } from "@store/useAppStore.js";
import dayjs from "dayjs";
import { dateISOToDoy } from "@lib/mapping.js";

export default function Controls() {
  const {
    lat, lon, date_of_interest, engine, window_days,
    spatial_mode, area_km, thresholds,
    setDate, setEngine, setWindow, setSpatialMode, setAreaKm,
    setThresholds, calculate, loading, error
  } = useAppStore();

  const nice = dayjs(date_of_interest).format("DD/MM/YYYY");
  const doy  = dateISOToDoy(date_of_interest);

  return (
    <div className="grid grid-cols-1 gap-4 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium mb-1">Coordenadas</div>
          <div className="text-slate-600">Lat: {lat.toFixed(4)} · Lon: {lon.toFixed(4)}</div>
        </div>
        <button onClick={calculate} disabled={loading} className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50">
          {loading ? "Calculando…" : "Calcular"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="font-medium block mb-1">Fecha</label>
          <input type="date" value={date_of_interest} onChange={(e)=>setDate(e.target.value)} className="border rounded px-2 py-1 w-full"/>
          <div className="text-slate-500 mt-1">Seleccionada: {nice} · DOY: {doy}</div>
        </div>

        <div>
          <label className="font-medium block mb-1">Modelo</label>
          <select value={engine} onChange={(e)=>setEngine(e.target.value)} className="border rounded px-2 py-1 w-full">
            <option value="logistic">logistic</option>
            <option value="climatology">climatology</option>
            <option value="gev">gev</option>
          </select>
        </div>

        <div>
          <label className="font-medium block mb-1">Ventana ± días: {window_days}</label>
          <input type="range" min="5" max="45" value={window_days} onChange={(e)=>setWindow(parseInt(e.target.value))} className="w-full" />
        </div>

        <div>
          <label className="font-medium block mb-1">Modo espacial</label>
          <select value={spatial_mode} onChange={(e)=>setSpatialMode(e.target.value)} className="border rounded px-2 py-1 w-full">
            <option value="nearest">nearest</option>
            <option value="box_avg">box_avg</option>
          </select>
          <div className="mt-2">
            <label className="text-sm">Área (km) {spatial_mode!=="box_avg" ? "(inactivo)" : ""}</label>
            <input type="number" min="1" value={area_km}
                   disabled={spatial_mode!=="box_avg"}
                   onChange={(e)=>setAreaKm(Number(e.target.value))}
                   className="border rounded px-2 py-1 w-full disabled:bg-slate-100"/>
          </div>
        </div>
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

      {error && <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">{error}</div>}
    </div>
  );
}
