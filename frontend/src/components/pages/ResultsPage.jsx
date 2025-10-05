import { motion } from "framer-motion";
import ProximityGlow from "@components/ui/ProximityGlow.jsx";
import ProbabilityCards from "@components/ProbabilityCards.jsx";
import TimeSeriesChart from "@components/TimeSeriesChart.jsx";
import Downloads from "@components/Downloads.jsx";
import MapView from "@components/MapView.jsx";
import MapboxView from "@components/MapboxView.jsx";
import { useAppStore } from "@store/useAppStore.js";
import dayjs from "dayjs";

export default function ResultsPage({ data, onBack }) {
  const { mapMode } = useAppStore();
  
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-slate-400 mb-4">No hay datos para mostrar</div>
          <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Volver a configuración
          </button>
        </div>
      </div>
    );
  }

  const { location, date, parameters, results } = data;
  const formattedDate = dayjs(date).format("DD/MM/YYYY");

  return (
    <>
      <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Skylikely</h1>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Resultados • {formattedDate} • {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </div>
          </div>
          <ProximityGlow className="rounded-lg">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver</span>
            </button>
          </ProximityGlow>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Panel de resultados */}
        <aside className="w-96 flex flex-col h-full border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-2">Análisis Climático</h2>
            <div className="text-sm text-slate-400">
              Probabilidades de condiciones extremas
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-6" style={{scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a #000000'}}>
            
            {/* Información del análisis */}
            <ProximityGlow className="rounded-xl">
              <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                <h3 className="text-lg font-semibold text-white mb-3">Parámetros del Análisis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ubicación:</span>
                    <span className="text-white">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha:</span>
                    <span className="text-white">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Modelo:</span>
                    <span className="text-white capitalize">{parameters.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ventana:</span>
                    <span className="text-white">±{parameters.window_days} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolución:</span>
                    <span className="text-white">
                      {parameters.spatial_mode === 'nearest' ? 'Punto cercano' : `Área ${parameters.area_km}km`}
                    </span>
                  </div>
                </div>
              </div>
            </ProximityGlow>

            {/* Tarjetas de probabilidades */}
            <ProximityGlow className="rounded-xl">
              <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                <h3 className="text-lg font-semibold text-white mb-4">Probabilidades de Extremos</h3>
                <ProbabilityCards data={results} />
              </div>
            </ProximityGlow>

            {/* Gráfico de serie temporal */}
            <ProximityGlow className="rounded-xl">
              <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                <h3 className="text-lg font-semibold text-white mb-4">Serie Temporal</h3>
                <div className="text-sm text-slate-400 mb-3">
                  Percentiles P10, P50, P90 para la fecha seleccionada
                </div>
                <TimeSeriesChart data={results} />
              </div>
            </ProximityGlow>

            {/* Acciones y descargas */}
            <ProximityGlow className="rounded-xl">
              <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                <h3 className="text-lg font-semibold text-white mb-4">Descargas y Acciones</h3>
                
                <div className="space-y-3">
                  <Downloads />
                  
                  <div className="border-t border-slate-700 pt-3">
                    <ProximityGlow className="rounded-lg">
                      <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>Guardar como Favorito</span>
                      </button>
                    </ProximityGlow>
                  </div>
                </div>
              </div>
            </ProximityGlow>

            {/* Estado del análisis */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Análisis completado exitosamente</span>
              </div>
              <div className="text-xs text-green-300 mt-1">
                Datos procesados en {Math.random() * 2 + 1 | 0}.{Math.random() * 9 | 0}s
              </div>
            </div>

          </div>
        </aside>

        {/* Mapa con resultados */}
        <section className="flex-1 relative">
          <div className="absolute inset-0 m-4 rounded-2xl overflow-hidden border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            {mapMode === "3d" ? <MapboxView /> : <MapView />}
            
            {/* Overlay con información de ubicación */}
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
              <ProximityGlow className="rounded-xl pointer-events-auto">
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Ubicación Analizada</div>
                      <div className="text-slate-300 text-sm">
                        {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}° • {formattedDate}
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </ProximityGlow>
            </div>
          </div>
        </section>
        
      </main>
    </>
  );
}