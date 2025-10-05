import { useAppStore } from "@store/useAppStore.js";
import dayjs from "dayjs";
import { dateISOToDoy } from "@lib/mapping.js";
import ProximityGlow from "@components/ui/ProximityGlow.jsx";

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
      <ProximityGlow className="rounded-lg">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
        <div>
          <div className="font-medium mb-1 text-slate-800 dark:text-white">Coordenadas</div>
          <div className="text-slate-600 dark:text-slate-300 text-xs">Lat: {lat.toFixed(4)} · Lon: {lon.toFixed(4)}</div>
        </div>
        <ProximityGlow className="rounded-lg" c1="rgba(34,197,94,0.32)" c2="rgba(59,130,246,0.28)">
          <button 
            onClick={calculate} 
            disabled={loading} 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {loading ? "Calculando…" : "Calcular"}
          </button>
        </ProximityGlow>
      </div>
      </ProximityGlow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="font-medium block mb-1 text-slate-700 dark:text-white">Fecha</label>
          <ProximityGlow className="rounded-lg">
            <input type="date" value={date_of_interest} onChange={(e)=>setDate(e.target.value)} className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          </ProximityGlow>
          <div className="text-slate-500 dark:text-slate-300 mt-1 text-xs">Seleccionada: {nice} · DOY: {doy}</div>
        </div>

        <div>
          <label className="font-medium block mb-1 text-slate-700 dark:text-white">Modelo</label>
          <ProximityGlow className="rounded-lg">
            <select value={engine} onChange={(e)=>setEngine(e.target.value)} className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="logistic">logistic</option>
              <option value="climatology">climatology</option>
              <option value="gev">gev</option>
            </select>
          </ProximityGlow>
        </div>

        <div>
          <label className="font-medium block mb-1 text-slate-700 dark:text-white">Ventana ± días: {window_days}</label>
          <ProximityGlow className="rounded-lg">
            <input type="range" min="5" max="45" value={window_days} onChange={(e)=>setWindow(parseInt(e.target.value))} className="w-full custom-slider" />
          </ProximityGlow>
        </div>

        <div>
          <label className="font-medium block mb-1 text-slate-700 dark:text-white">Modo espacial</label>
          <ProximityGlow className="rounded-lg">
            <select value={spatial_mode} onChange={(e)=>setSpatialMode(e.target.value)} className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="nearest">nearest</option>
              <option value="box_avg">box_avg</option>
            </select>
          </ProximityGlow>
          <div className="mt-2">
            <label className="text-sm text-slate-700 dark:text-white">Área (km) {spatial_mode!=="box_avg" ? "(inactivo)" : ""}</label>
            <ProximityGlow className="rounded-lg">
              <input type="number" min="1" value={area_km}
                     disabled={spatial_mode!=="box_avg"}
                     onChange={(e)=>setAreaKm(Number(e.target.value))}
                     className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm disabled:bg-slate-100 disabled:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </ProximityGlow>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <ProximityGlow className="rounded-lg" c1="rgba(251,191,36,0.28)" c2="rgba(59,130,246,0.18)">
        <div className="bg-amber-50 dark:bg-slate-900/40 border border-amber-200 dark:border-slate-700 rounded-lg p-3">
          <h4 className="font-medium text-slate-800 dark:text-white mb-3 text-sm">Umbrales de Extremos</h4>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-sm text-slate-700 dark:text-white font-medium block mb-1">Muy caliente (°C): {thresholds.very_hot_C}</label>
              <ProximityGlow className="rounded-lg">
                <input type="number" className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       value={thresholds.very_hot_C}
                       onChange={(e)=>setThresholds({ ...thresholds, very_hot_C: Number(e.target.value) })}/>
              </ProximityGlow>
            </div>
            <div>
              <label className="text-sm text-slate-700 dark:text-white font-medium block mb-1">Muy húmedo (mm): {thresholds.very_wet_mm}</label>
              <ProximityGlow className="rounded-lg">
                <input type="number" className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       value={thresholds.very_wet_mm}
                       onChange={(e)=>setThresholds({ ...thresholds, very_wet_mm: Number(e.target.value) })}/>
              </ProximityGlow>
            </div>
            <div>
              <label className="text-sm text-slate-700 dark:text-white font-medium block mb-1">Muy ventoso (m/s): {thresholds.very_windy_ms}</label>
              <ProximityGlow className="rounded-lg">
                <input type="number" className="bg-white/3 backdrop-blur-sm border border-white/10 text-black rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       value={thresholds.very_windy_ms}
                       onChange={(e)=>setThresholds({ ...thresholds, very_windy_ms: Number(e.target.value) })}/>
              </ProximityGlow>
            </div>
          </div>
        </div>
        </ProximityGlow>
      </div>

      {error && <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">{error}</div>}
    </div>
  );
}
