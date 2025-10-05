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
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
      <input className="border rounded px-2 py-1" value={alat} onChange={e=>setAlat(e.target.value)} placeholder="Latitud -90..90" />
      <input className="border rounded px-2 py-1" value={alon} onChange={e=>setAlon(e.target.value)} placeholder="Longitud -180..180" />
      <button onClick={apply} className="border rounded px-3 py-1 bg-white hover:bg-slate-50">Ir</button>
    </div>
  );
}
