import { useState, useEffect } from "react";
import { useAppStore } from "@store/useAppStore.js";
import { motion } from "framer-motion";
import MapView from "@components/MapView.jsx";
import MapboxView from "@components/MapboxView.jsx";
import MapModeSwitch from "@components/MapModeSwitch.jsx";
import SearchBar from "@components/SearchBar.jsx";
import CoordInputs from "@components/CoordInputs.jsx";
import LiquidHeading from "@components/ui/LiquidHeading.jsx";
import ProximityGlow from "@components/ui/ProximityGlow.jsx";
import dayjs from "dayjs";
import { dateISOToDoy } from "@lib/mapping.js";

export default function ParameterSelectionPage({ onCalculate }) {
  const { 
    data, loading, mapMode, panelVisible, togglePanel,
    lat, lon, date_of_interest, engine, window_days, spatial_mode, area_km,
    setDate, setEngine, setWindow, setSpatialMode, setAreaKm, calculate
  } = useAppStore();

  // Toast state
  const [showToast, setShowToast] = useState(true);

  const nice = dayjs(date_of_interest).format("DD/MM/YYYY");
  const doy = dateISOToDoy(date_of_interest);

  // Verificar si los parámetros mínimos están listos
  const canCalculate = lat !== null && lon !== null && date_of_interest && !loading;

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleCalculate = async () => {
    if (!canCalculate) return;
    
    // Ejecutar el cálculo del store
    await calculate();
    
    // Simular datos para el prototipo (reemplazar con datos reales del store)
    const resultData = {
      location: { lat, lon },
      date: date_of_interest,
      parameters: { engine, window_days, spatial_mode, area_km },
      // Aquí irían los resultados reales del cálculo
      results: data
    };
    
    onCalculate(resultData);
  };

  // Actualiza variables CSS para el glow según el mouse
  const onMouseMoveNav = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mx", `${x}px`);
    target.style.setProperty("--my", `${y}px`);
  };

  return (
    <>
      <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Skylikely</h1>
          <nav className="text-sm text-slate-500 dark:text-slate-400">Selección de parámetros</nav>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Motivational Toast - Top Center */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ 
            opacity: showToast ? 1 : 0, 
            y: showToast ? 0 : -50,
            scale: showToast ? 1 : 0.9
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-[9999] ${showToast ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <ProximityGlow className="rounded-2xl" c1="rgba(59,130,246,0.3)" c2="rgba(168,85,247,0.2)" radius={250} intensity={0.4}>
            <div className="bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-4 max-w-lg shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg leading-snug">
                    ¡Empieza ya! Selecciona tu ubicación, fecha y umbrales en el panel izquierdo para obtener un análisis preciso
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </ProximityGlow>
        </motion.div>

        <aside className={`flex flex-col h-full flex-shrink-0 transition-all duration-300 overflow-hidden ${panelVisible ? 'w-96' : 'w-0'}`}>
          <motion.nav
            initial="initial"
            whileHover="hover"
            className={`panel-nav relative h-full w-full flex flex-col min-h-0 ${panelVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 glass-surface border-r border-white/30 dark:border-white/10`}
            onMouseMove={onMouseMoveNav}
            style={{
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
            }}
          >
            <motion.div
              className="absolute -inset-8 pointer-events-none"
              variants={{ initial: { opacity: 0 }, hover: { opacity: 1, transition: { duration: 0.5, ease: [0.4,0,0.2,1] } } }}
              style={{
                background:
                  "radial-gradient(600px circle at var(--mx,0px) var(--my,0px), rgba(59,130,246,0.12), transparent 40%), radial-gradient(900px circle at var(--mx,0px) var(--my,0px), rgba(168,85,247,0.09), transparent 60%)",
                filter: "blur(20px)",
              }}
            />
            
            <div className="p-4 border-b border-white/30 dark:border-white/10 flex-shrink-0">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Configuración</h2>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto custom-scroll" style={{scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a #000000'}}>
              <div className="p-4 space-y-4">
                
                {/* Sección 1: Vista y Búsqueda */}
                <ProximityGlow className="rounded-xl">
                  <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                    <div className="mb-4"><LiquidHeading>Vista y Búsqueda</LiquidHeading></div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">Modo de Vista</label>
                        <MapModeSwitch />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-2">Búsqueda de Ubicación</label>
                        <SearchBar />
                      </div>
                    </div>
                  </div>
                </ProximityGlow>

                {/* Sección 2: Coordenadas Manuales */}
                <ProximityGlow className="rounded-xl">
                  <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                    <div className="mb-4"><LiquidHeading>Coordenadas Manuales</LiquidHeading></div>
                    <CoordInputs />
                  </div>
                </ProximityGlow>

                {/* Sección 3: Fecha y Parámetros */}
                <ProximityGlow className="rounded-xl">
                  <div className="rounded-xl p-4 border glass-card border-white/30 dark:border-white/10" style={{ backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                    <div className="mb-4"><LiquidHeading>Fecha y Parámetros</LiquidHeading></div>
                    <div className="space-y-4">
                      
                      {/* Ubicación actual */}
                      <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium mb-1 text-slate-800 dark:text-white text-sm">Ubicación Seleccionada</div>
                            <div className="text-slate-600 dark:text-slate-300 text-xs">
                              {lat && lon ? `Lat: ${lat.toFixed(4)} · Lon: ${lon.toFixed(4)}` : 'No seleccionada'}
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${lat && lon ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                      </div>

                      {/* Fecha */}
                      <div>
                        <label className="font-medium block mb-2 text-slate-700 dark:text-white text-sm">Fecha de análisis</label>
                        <ProximityGlow className="rounded-lg">
                          <input 
                            type="date" 
                            value={date_of_interest} 
                            onChange={(e)=>setDate(e.target.value)} 
                            className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </ProximityGlow>
                        <div className="text-slate-500 dark:text-slate-300 mt-1 text-xs">Seleccionada: {nice} · DOY: {doy}</div>
                      </div>

                      {/* Modelo */}
                      <div>
                        <label className="font-medium block mb-2 text-slate-700 dark:text-white text-sm">Modelo de análisis</label>
                        <ProximityGlow className="rounded-lg">
                          <select 
                            value={engine} 
                            onChange={(e)=>setEngine(e.target.value)} 
                            className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="logistic">Logístico</option>
                            <option value="climatology">Climatología</option>
                            <option value="gev">GEV</option>
                          </select>
                        </ProximityGlow>
                      </div>

                      {/* Ventana temporal */}
                      <div>
                        <label className="font-medium block mb-2 text-slate-700 dark:text-white text-sm">Ventana temporal: ±{window_days} días</label>
                        <ProximityGlow className="rounded-lg">
                          <input 
                            type="range" 
                            min="5" 
                            max="45" 
                            value={window_days} 
                            onChange={(e)=>setWindow(parseInt(e.target.value))} 
                            className="w-full custom-slider" 
                          />
                        </ProximityGlow>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Datos históricos en un rango de {window_days * 2} días alrededor de la fecha
                        </div>
                      </div>

                      {/* Modo espacial */}
                      <div>
                        <label className="font-medium block mb-2 text-slate-700 dark:text-white text-sm">Resolución espacial</label>
                        <ProximityGlow className="rounded-lg">
                          <select 
                            value={spatial_mode} 
                            onChange={(e)=>setSpatialMode(e.target.value)} 
                            className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="nearest">Punto más cercano</option>
                            <option value="box_avg">Promedio de área</option>
                          </select>
                        </ProximityGlow>
                        
                        {spatial_mode === "box_avg" && (
                          <div className="mt-3">
                            <label className="text-sm text-slate-700 dark:text-white font-medium block mb-1">Área de promedio (km)</label>
                            <ProximityGlow className="rounded-lg">
                              <input 
                                type="number" 
                                min="1" 
                                value={area_km}
                                onChange={(e)=>setAreaKm(Number(e.target.value))}
                                className="bg-black/60 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </ProximityGlow>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ProximityGlow>



              </div>
            </div>
          </motion.nav>
        </aside>

        {/* Toggle Button - Simple and reliable */}
        <div className="absolute top-4 z-[9999] transition-all duration-300" style={{ left: panelVisible ? '350px' : '16px' }}>
          <ProximityGlow className="rounded-lg">
            <button
              onClick={togglePanel}
              className="bg-slate-900/90 backdrop-blur-sm text-white border border-slate-700 shadow-lg rounded-lg p-3 hover:bg-slate-800 transition-all duration-300"
              title={panelVisible ? "Ocultar panel" : "Mostrar panel"}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {panelVisible ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </ProximityGlow>
        </div>

        <section className="flex-1 relative">
          <div className="absolute inset-0 m-4 rounded-2xl overflow-hidden border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            {mapMode === "3d" ? <MapboxView /> : <MapView />}
          </div>
          
          {/* Extra Large Calculate Button - Bottom Right */}
          <div className="absolute bottom-6 right-6 z-[9999]">
            <ProximityGlow className="rounded-3xl" c1="rgba(239,68,68,0.6)" c2="rgba(220,38,127,0.5)" radius={400} intensity={0.8}>
              <button 
                onClick={handleCalculate} 
                disabled={!canCalculate} 
                className={`px-12 py-8 rounded-3xl font-black text-2xl transition-all duration-300 flex items-center justify-center space-x-6 min-w-[420px] shadow-2xl ${
                  canCalculate 
                    ? 'bg-gradient-to-r from-red-600 via-pink-600 to-red-700 text-white hover:from-red-500 hover:via-pink-500 hover:to-red-600 hover:shadow-red-500/40 hover:scale-110 transform' 
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span>Calculando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Calcular Probabilidades</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </ProximityGlow>
            
            {!canCalculate && (
              <div className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-amber-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Parámetros incompletos</span>
                </div>
                <div className="text-xs text-amber-300 mt-1">
                  {!lat || !lon ? 'Selecciona una ubicación. ' : ''}
                  {!date_of_interest ? 'Selecciona una fecha.' : ''}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}