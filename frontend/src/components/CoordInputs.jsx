import { useState } from "react";
import { useAppStore } from "@store/useAppStore.js";

export default function CoordInputs() {
  const { lat, lon, setCoords } = useAppStore();
  const [alat, setAlat] = useState(lat.toFixed(6));
  const [alon, setAlon] = useState(lon.toFixed(6));

  const apply = () => {
    const la = Number(alat), lo = Number(alon);
    if (Number.isFinite(la) && Number.isFinite(lo) && la>=-90 && la<=90 && lo>=-180 && lo<=180) {
      setCoords(la, lo);
    } else {
      alert("Coordenadas inválidas");
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-600 block mb-1">Latitud</label>
          <input 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={alat} 
            onChange={e=>setAlat(e.target.value)} 
            placeholder="-90 a 90" 
          />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Longitud</label>
          <input 
            className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={alon} 
            onChange={e=>setAlon(e.target.value)} 
            placeholder="-180 a 180" 
          />
        </div>
      </div>
      <button 
        onClick={apply} 
        className="w-full bg-slate-600 text-white rounded-lg px-4 py-2 hover:bg-slate-700 text-sm font-medium transition-colors"
      >
        Aplicar Coordenadas
      </button>
    </div>
  );
}
