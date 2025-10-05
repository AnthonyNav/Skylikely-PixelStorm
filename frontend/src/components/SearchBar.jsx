import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@store/useAppStore.js";

const API = "https://nominatim.openstreetmap.org/search";

export default function SearchBar() {
  const setCoords = useAppStore(s => s.setCoords);
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef(null);
  const tRef = useRef(null);

  useEffect(() => {
    if (!q || q.trim().length < 3) { setItems([]); return; }
    clearTimeout(tRef.current);
    tRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const url = `${API}?format=json&accept-language=es&limit=6&q=${encodeURIComponent(q)}`;
      try {
        const res = await fetch(url, { signal: abortRef.current.signal, headers: { "User-Agent": "Skylikely-Demo" }});
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.map(d => ({ label: d.display_name, lat: +d.lat, lon: +d.lon })));
        setOpen(true);
      } catch { /* ignorar */ }
    }, 250);
    return () => clearTimeout(tRef.current);
  }, [q]);

  const choose = (it) => {
    setQ(it.label);
    setItems([]);
    setOpen(false);
    setCoords(it.lat, it.lon);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Buscar lugar (tipo Google Maps)…"
        className="w-full border rounded-lg px-3 py-2"
        onFocus={()=> items.length && setOpen(true)}
        onBlur={()=> setTimeout(()=>setOpen(false), 150)}
      />
      {open && items.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={()=>choose(it)}
              className="w-full text-left px-3 py-2 hover:bg-slate-50"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
      <div className="text-[11px] text-slate-500 mt-1">
        Búsqueda por <a className="underline" href="https://nominatim.openstreetmap.org" target="_blank">Nominatim</a> · límite 6
      </div>
    </div>
  );
}
