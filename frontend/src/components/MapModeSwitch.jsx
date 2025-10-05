import { useAppStore } from "@store/useAppStore.js";

export default function MapModeSwitch() {
  const { mapMode, setMapMode } = useAppStore();
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600">Vista</span>
      <div className="inline-flex rounded-lg border overflow-hidden">
        <button
          onClick={()=>setMapMode("2d")}
          className={`px-3 py-1.5 text-sm ${mapMode==="2d"?"bg-slate-900 text-white":"bg-white hover:bg-slate-50"}`}>
          2D
        </button>
        <button
          onClick={()=>setMapMode("3d")}
          className={`px-3 py-1.5 text-sm ${mapMode==="3d"?"bg-slate-900 text-white":"bg-white hover:bg-slate-50"}`}>
          3D
        </button>
      </div>
    </div>
  );
}
