import { useAppStore } from "@store/useAppStore.js";

export default function MapModeSwitch() {
  const { mapMode, setMapMode } = useAppStore();
  return (
    <div className="bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => setMapMode("2d")}
        className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-white text-slate-900 shadow-sm"
      >
        <span className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 01.553-.894L9 4l6 3 5.447-2.724A1 1 0 0121 5.382v8.764a1 1 0 01-.553.894L15 17l-6-3z" />
          </svg>
          <span>Vista de Mapa</span>
        </span>
      </button>
    </div>
  );
}
