import { useAppStore } from "@store/useAppStore.js";
import Controls from "@components/Controls.jsx";
import ProbabilityCards from "@components/ProbabilityCards.jsx";
import TimeSeriesChart from "@components/TimeSeriesChart.jsx";
import MapView from "@components/MapView.jsx";
import MapboxView from "@components/MapboxView.jsx";

import MapModeSwitch from "@components/MapModeSwitch.jsx";
import SearchBar from "@components/SearchBar.jsx";
import CoordInputs from "@components/CoordInputs.jsx";

export default function App() {
  const { data, loading, mapMode, panelVisible, togglePanel } = useAppStore();
  
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b bg-white flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Skylikely</h1>
          <nav className="text-sm text-slate-500">Demo sin backend</nav>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <aside className={`bg-white border-r shadow-sm flex flex-col h-full flex-shrink-0 transition-all duration-300 overflow-hidden ${panelVisible ? 'w-80' : 'w-0'}`}>
          <div className={`transition-opacity duration-300 flex flex-col h-full ${panelVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-4 border-b flex-shrink-0">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">Panel de Control</h2>
                <MapModeSwitch />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Búsqueda de Ubicación</h3>
                <SearchBar />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="p-4 space-y-6">
                <div className="bg-slate-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Coordenadas Manuales</h3>
                  <CoordInputs />
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Configuración</h3>
                  <Controls />
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Probabilidades</h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-600">Procesando...</p>
                    </div>
                  ) : (
                    <ProbabilityCards data={data} />
                  )}
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Serie Temporal</h3>
                  <TimeSeriesChart data={data} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <button
          onClick={togglePanel}
          className={`absolute top-20 bg-white border shadow-lg rounded-lg p-2 hover:bg-slate-50 transition-all duration-300 ${panelVisible ? 'left-72' : 'left-2'}`}
          style={{ zIndex: 9999 }}
          title={panelVisible ? "Ocultar panel" : "Mostrar panel"}
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {panelVisible ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
            )}
          </svg>
        </button>

        <section className="flex-1 relative">
          <div className="absolute inset-0 m-4 rounded-2xl overflow-hidden border bg-white shadow-sm">
            {mapMode === "3d" ? <MapboxView /> : <MapView />}
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-slate-500">
                    Datos de ejemplo precomputados. Mapas © Mapbox, OpenStreetMap contributors, © Esri.
        </div>
      </footer>
    </div>
  );
}
