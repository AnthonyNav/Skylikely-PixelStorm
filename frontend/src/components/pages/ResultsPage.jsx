import { motion } from "framer-motion";
import { useEffect } from "react";
import Lottie from "lottie-react";
import ProximityGlow from "@components/ui/ProximityGlow.jsx";
import ProbabilityCards from "@components/ProbabilityCards.jsx";
import TimeSeriesChart from "@components/TimeSeriesChart.jsx";
import Downloads from "@components/Downloads.jsx";
import StaticMapView from "@components/StaticMapView.jsx";
import { useAppStore } from "@store/useAppStore.js";
import dayjs from "dayjs";
import LottieBackground from "@components/ui/LottieBackground.jsx";

// Importar animaciones meteorológicas
import sunnyAnimation from "../../animations/sunny.json";
import rainyAnimation from "../../animations/rainy icon.json";
import cloudyAnimation from "../../animations/cloudy icon (1).json";
import windyAnimation from "../../animations/windy icon.json";
import snowyAnimation from "../../animations/snow icon.json";

export default function ResultsPage({ data, onBack }) {
  const { mapMode } = useAppStore();

  // Función para determinar la animación meteorológica basada en los datos
  const getWeatherAnimation = (results) => {
    if (!results?.stats) return { animation: sunnyAnimation, type: 'sunny' };

    const { t2m, prcp, wind10m } = results.stats;
    const thresholds = results.thresholds || {};

    // Obtener valores principales
    const tempAvg = t2m?.p50 || 20;
    const tempMin = t2m?.p10 || 15;
    const precipProb = prcp?.p_over_threshold || 0;
    const precipAvg = prcp?.p50 || 0;
    const precipMax = prcp?.p90 || 0;
    const windProb = wind10m?.p_over_threshold || 0;
    const windAvg = wind10m?.p50 || 0;
    const windMax = wind10m?.p90 || 0;

    // Prioridad: Snow > Rain > Wind > Cloudy > Sunny
    
    // 1. NIEVE: Temperatura muy baja (menos de 2°C promedio o menos de 0°C mínima)
    if (tempAvg < 2 || tempMin < 0) {
      return { animation: snowyAnimation, type: 'snowy' };
    }

    // 2. LLUVIA: Alta probabilidad de precipitación o valores significativos
    if (precipProb > 0.35 || precipMax > (thresholds.very_wet_mm || 15) || precipAvg > 8) {
      return { animation: rainyAnimation, type: 'rainy' };
    }

    // 3. VIENTO: Alta probabilidad de viento fuerte o velocidades significativas
    if (windProb > 0.25 || windMax > (thresholds.very_windy_ms || 10) || windAvg > 8) {
      return { animation: windyAnimation, type: 'windy' };
    }

    // 4. NUBLADO: Condiciones moderadas de precipitación o tiempo parcialmente cubierto
    if (precipProb > 0.15 || precipAvg > 3 || (precipMax > 8 && windAvg > 5)) {
      return { animation: cloudyAnimation, type: 'cloudy' };
    }

    // 5. SOLEADO: Condiciones claras (baja precipitación, viento moderado, temperatura agradable)
    return { animation: sunnyAnimation, type: 'sunny' };
  };

  // Configurar scroll suave y fondo para toda la página
  useEffect(() => {
    // Aplicar scroll suave al document
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';
    
    // Asegurar que no hay overflow hidden en body
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyBackground = document.body.style.background;
    const originalHtmlBackground = document.documentElement.style.background;
    
    document.body.style.overflow = 'auto';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Aplicar el mismo gradiente al body y html para evitar bordes blancos
    const gradient = 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #6b21a8 100%)';
    document.body.style.background = gradient;
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.minHeight = '100vh';
    
    document.documentElement.style.background = gradient;
    document.documentElement.style.backgroundAttachment = 'fixed';
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    document.documentElement.style.backgroundSize = 'cover';
    document.documentElement.style.minHeight = '100vh';
    
    return () => {
      // Limpiar al desmontar
      document.documentElement.style.scrollBehavior = '';
      document.body.style.scrollBehavior = '';
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.background = originalBodyBackground;
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundSize = '';
      document.body.style.minHeight = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.background = originalHtmlBackground;
      document.documentElement.style.backgroundAttachment = '';
      document.documentElement.style.backgroundRepeat = '';
      document.documentElement.style.backgroundSize = '';
      document.documentElement.style.minHeight = '';
    };
  }, []);
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <LottieBackground />
        <div className="text-center z-10">
          <div className="text-lg text-white mb-4">No hay datos para mostrar</div>
          <ProximityGlow className="rounded-lg">
            <button onClick={onBack} className="px-6 py-3 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg border border-white/20">
              Volver a configuración
            </button>
          </ProximityGlow>
        </div>
      </div>
    );
  }

  const { location, date, parameters, results } = data;
  const formattedDate = dayjs(date).format("DD/MM/YYYY");

  // Función para generar recomendaciones basadas en los datos
  const generateRecommendations = (results) => {
    const recommendations = [];
    const warnings = [];

    if (results?.stats) {
      // Análisis de temperatura
      if (results.stats.t2m?.p_over_threshold > 0.7) {
        warnings.push({
          type: "extreme_heat",
          icon: "🌡️",
          title: "Calor Extremo",
          message: `${(results.stats.t2m.p_over_threshold * 100).toFixed(0)}% probabilidad de superar ${results.thresholds.very_hot_C}°C`,
          severity: "high"
        });
        recommendations.push("Evitar actividades al aire libre durante las horas más calurosas (11am-4pm)");
        recommendations.push("Mantenerse hidratado y buscar lugares con aire acondicionado");
      } else if (results.stats.t2m?.p_over_threshold > 0.3) {
        warnings.push({
          type: "high_temp",
          icon: "☀️",
          title: "Temperatura Elevada",
          message: `${(results.stats.t2m.p_over_threshold * 100).toFixed(0)}% probabilidad de calor intenso`,
          severity: "medium"
        });
        recommendations.push("Usar protector solar y ropa ligera");
        recommendations.push("Planificar actividades temprano en la mañana o al atardecer");
      } else {
        recommendations.push("Temperatura agradable, ideal para actividades al aire libre");
      }

      // Análisis de precipitación  
      if (results.stats.prcp?.p_over_threshold > 0.6) {
        warnings.push({
          type: "heavy_rain",
          icon: "🌧️",
          title: "Lluvia Intensa",
          message: `${(results.stats.prcp.p_over_threshold * 100).toFixed(0)}% probabilidad de lluvia fuerte`,
          severity: "high"
        });
        recommendations.push("Llevar paraguas y ropa impermeable");
        recommendations.push("Evitar conducir por áreas propensas a inundaciones");
      } else if (results.stats.prcp?.p_over_threshold > 0.2) {
        recommendations.push("Posibilidad de lluvia, llevar paraguas por precaución");
      } else {
        recommendations.push("Condiciones secas, perfecto para picnics y caminatas");
      }

      // Análisis de viento
      if (results.stats.wind10m?.p_over_threshold > 0.5) {
        warnings.push({
          type: "strong_wind",
          icon: "💨",
          title: "Vientos Fuertes",
          message: `${(results.stats.wind10m.p_over_threshold * 100).toFixed(0)}% probabilidad de vientos intensos`,
          severity: "high"
        });
        recommendations.push("Precaución con actividades aéreas y deportes acuáticos");
        recommendations.push("Asegurar objetos sueltos en exteriores");
      } else if (results.stats.wind10m?.p_over_threshold > 0.2) {
        recommendations.push("Vientos moderados, ideal para volar cometas o windsurf");
      } else {
        recommendations.push("Vientos calmados, perfecto para fotografía y relajación");
      }
    }

    return { recommendations, warnings };
  };

  const { recommendations, warnings } = generateRecommendations(results);

  // Función para generar datos de pronóstico por días
  const generateDailyForecast = (results, windowDays = 10) => {
    const days = [];
    const baseDate = dayjs(date);
    
    for (let i = -windowDays; i <= windowDays; i++) {
      const currentDate = baseDate.add(i, 'day');
      const isTargetDate = i === 0;
      
      // Simular variaciones basadas en los percentiles
      const tempVariation = Math.random() * 0.3 - 0.15; // ±15% variation
      const precipVariation = Math.random() * 0.5;
      
      days.push({
        date: currentDate.format("DD/MM"),
        dayName: currentDate.format("ddd"),
        isTarget: isTargetDate,
        temp: {
          min: Math.round((results?.stats?.t2m?.p10 || 20) * (1 + tempVariation)),
          max: Math.round((results?.stats?.t2m?.p90 || 30) * (1 + tempVariation)),
          avg: Math.round((results?.stats?.t2m?.p50 || 25) * (1 + tempVariation))
        },
        precipitation: Math.round((results?.stats?.prcp?.p50 || 5) * precipVariation),
        wind: Math.round((results?.stats?.wind10m?.p50 || 5) * (1 + tempVariation * 0.5)),
        condition: i === 0 ? 'target' : ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
      });
    }
    
    return days;
  };

  const dailyForecast = generateDailyForecast(results, parameters?.window_days || 10);
  const weatherAnimation = getWeatherAnimation(results);

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative"
      style={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.1)',
        minHeight: '100vh',
        height: 'auto',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #6b21a8 100%)',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <LottieBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Skylikely Weather</h1>
              <div className="text-sm text-blue-200">
                Análisis Climático • {formattedDate} • {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ProximityGlow className="rounded-lg">
              <button className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </ProximityGlow>
            <ProximityGlow className="rounded-lg">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver</span>
              </button>
            </ProximityGlow>
          </div>
        </div>
      </header>

      {/* Main Content - Grid con scroll natural */}
      <main className="relative z-10 w-full">
        <div className="p-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-6 auto-rows-max">
            
            {/* Primera Fila - 4 tarjetas */}
            {/* Tarjeta 1: Clima Promedio */}
            <div className="col-span-12 lg:col-span-3">
              <ProximityGlow className="rounded-2xl h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Clima Promedio</h2>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Temperatura principal con animación */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-6 mb-3">
                        <div className="text-5xl font-bold text-white">
                          {Math.round(results?.stats?.t2m?.p50 || 24)}°
                        </div>
                        <div className="w-20 h-20 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <Lottie 
                            animationData={weatherAnimation.animation}
                            loop={true}
                            autoplay={true}
                            style={{ width: '70%', height: '70%' }}
                          />
                        </div>
                      </div>
                      <div className="text-blue-200 text-lg mb-1">
                        {formattedDate}
                      </div>
                      <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                        <div className="text-blue-300 text-sm font-medium">
                          {weatherAnimation.type === 'sunny' && 'Condiciones Soleadas'}
                          {weatherAnimation.type === 'rainy' && 'Condiciones Lluviosas'}
                          {weatherAnimation.type === 'cloudy' && 'Condiciones Nubladas'}
                          {weatherAnimation.type === 'windy' && 'Condiciones Ventosas'}
                          {weatherAnimation.type === 'snowy' && 'Condiciones Nevadas'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Estadísticas detalladas */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-300 text-sm">Mínima</div>
                        <div className="text-white font-semibold text-lg">
                          {Math.round(results?.stats?.t2m?.p10 || 18)}°
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-300 text-sm">Máxima</div>
                        <div className="text-white font-semibold text-lg">
                          {Math.round(results?.stats?.t2m?.p90 || 30)}°
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-300 text-sm">Humedad</div>
                        <div className="text-white font-semibold text-lg">65%</div>
                      </div>
                    </div>

                    {/* Otras variables */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          </div>
                          <span className="text-blue-200">Precipitación</span>
                        </div>
                        <span className="text-white font-medium">
                          {Math.round(results?.stats?.prcp?.p50 || 5)} mm
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                          </div>
                          <span className="text-blue-200">Viento</span>
                        </div>
                        <span className="text-white font-medium">
                          {Math.round(results?.stats?.wind10m?.p50 || 8)} m/s
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ProximityGlow>
            </div>

            {/* Tarjeta 2: Mapa de Ubicación */}
            <div className="col-span-12 lg:col-span-3">
              <ProximityGlow className="rounded-2xl h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                >
                  {/* Header compacto */}
                  <div className="p-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-bold text-white">Ubicación</h2>
                      <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs">Analizada</span>
                      </div>
                    </div>
                    <div className="text-blue-200 text-sm">
                      📍 {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
                    </div>
                    <div className="text-blue-300 text-xs mt-1">
                      Ventana: ±{parameters?.window_days || 10} días
                    </div>
                  </div>
                  
                  {/* Mapa expandido */}
                  <div className="flex-1 relative min-h-[300px]">
                    <StaticMapView lat={location.lat} lon={location.lon} zoom={10} />
                    
                    {/* Badge flotante */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="text-white text-xs font-medium">
                          🔒 Solo Vista
                        </div>
                      </div>
                    </div>
                    
                    {/* Info de región */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2">
                        <div className="text-white text-xs font-medium">
                          {results?.adaptationInfo?.region || 'Análisis Climatológico'}
                        </div>
                        {results?.adaptationInfo && (
                          <div className="text-blue-200 text-xs">
                            Datos: {results.adaptationInfo.dataSource?.replace('_', ' ').replace('doy', 'DOY ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ProximityGlow>
            </div>

            {/* Tarjeta 3: Actividades Recomendadas */}
            <div className="col-span-12 lg:col-span-3">
              <ProximityGlow className="rounded-2xl h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recomendaciones</h2>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.707l-.707.707M21 12h-1M17.657 18.364l-.707-.707M12 21v-1m-6.364-.707l.707.707M3 12h1M6.343 5.636l.707.707" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[calc(100%-100px)]">
                    {/* Advertencias críticas */}
                    {warnings.map((warning, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        warning.severity === 'high' ? 'bg-red-500/10 border-red-500' :
                        warning.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                        'bg-blue-500/10 border-blue-500'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{warning.icon}</span>
                          <span className="text-white font-medium text-sm">{warning.title}</span>
                        </div>
                        <div className="text-blue-200 text-xs">{warning.message}</div>
                      </div>
                    ))}

                    {/* Recomendaciones generales */}
                    <div className="space-y-2">
                      {recommendations.slice(0, 6).map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-white/5 rounded-lg">
                          <div className="w-5 h-5 mt-0.5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-blue-100 text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ProximityGlow>
            </div>

            {/* Tarjeta 4: Análisis Estadístico - Parte 1 */}
            <div className="col-span-12 lg:col-span-3">
              <ProximityGlow className="rounded-2xl h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Análisis Estadístico</h2>
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Gráfica de Percentiles */}
                    <div>
                      <div className="text-blue-200 text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Distribución de Temperatura
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 text-sm">P10 (frío)</span>
                          <span className="text-white font-medium">{Math.round(results?.stats?.t2m?.p10 || 18)}°C</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 text-sm">P50 (promedio)</span>
                          <span className="text-white font-medium">{Math.round(results?.stats?.t2m?.p50 || 24)}°C</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 text-sm">P90 (calor)</span>
                          <span className="text-white font-medium">{Math.round(results?.stats?.t2m?.p90 || 30)}°C</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Gráfica de Barras - Precipitación */}
                    <div>
                      <div className="text-blue-200 text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Patrones de Precipitación
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t mb-2" style={{ height: `${Math.max((results?.stats?.prcp?.p10 || 1) * 4, 16)}px`, maxHeight: '64px' }}></div>
                          <div className="text-xs text-blue-300">Seco</div>
                          <div className="text-sm text-white font-medium">{Math.round(results?.stats?.prcp?.p10 || 1)}mm</div>
                        </div>
                        <div className="text-center">
                          <div className="h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t mb-2" style={{ height: `${Math.max((results?.stats?.prcp?.p50 || 5) * 3, 24)}px`, maxHeight: '64px' }}></div>
                          <div className="text-xs text-blue-300">Normal</div>
                          <div className="text-sm text-white font-medium">{Math.round(results?.stats?.prcp?.p50 || 5)}mm</div>
                        </div>
                        <div className="text-center">
                          <div className="h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t mb-2" style={{ height: `${Math.min((results?.stats?.prcp?.p90 || 20) * 2, 64)}px` }}></div>
                          <div className="text-xs text-blue-300">Húmedo</div>
                          <div className="text-sm text-white font-medium">{Math.round(results?.stats?.prcp?.p90 || 20)}mm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ProximityGlow>
            </div>

            {/* Segunda Fila */}
            {/* Tarjeta 5: Pronóstico por Días - Ajustada */}
            <div className="col-span-12 lg:col-span-8">
              <ProximityGlow className="rounded-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl max-h-[450px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Pronóstico Extendido</h2>
                    <div className="text-blue-200 text-sm">
                      Ventana: ±{parameters?.window_days || 10} días
                    </div>
                  </div>

                  <div className="overflow-hidden h-[350px]">
                    <div className="flex space-x-4 overflow-x-auto pb-2 h-full">
                      {dailyForecast.map((day, index) => (
                        <div key={index} className={`flex-shrink-0 ${
                          day.isTarget ? 'bg-gradient-to-b from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50' : 'bg-white/5'
                        } rounded-xl p-5 min-w-[140px] text-center h-fit hover:bg-white/10 transition-colors`}>
                          <div className={`text-sm font-semibold mb-2 ${day.isTarget ? 'text-blue-300' : 'text-blue-200'}`}>
                            {day.dayName}
                          </div>
                          <div className={`text-sm mb-3 ${day.isTarget ? 'text-blue-400' : 'text-blue-300'}`}>
                            {day.date}
                          </div>
                          
                          {day.isTarget && (
                            <div className="text-xs text-yellow-400 font-bold mb-2 px-2 py-1 bg-yellow-400/20 rounded-full">HOY</div>
                          )}
                          
                          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-300 text-xs">Máx</span>
                              <span className="text-white font-bold text-lg">{day.temp.max}°</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-300 text-xs">Mín</span>
                              <span className="text-blue-200 text-sm">{day.temp.min}°</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-300 text-xs">Lluvia</span>
                              <span className="text-blue-200 text-sm">{day.precipitation}mm</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-300 text-xs">Viento</span>
                              <span className="text-blue-200 text-sm">{day.wind}m/s</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ProximityGlow>
            </div>

            {/* Tarjeta 6: Monitoreo Avanzado - Ajustada al contenido */}
            <div className="col-span-12 lg:col-span-4">
              <ProximityGlow className="rounded-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Monitoreo Avanzado</h2>
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Gráfica de Viento */}
                    <div>
                      <div className="text-blue-200 text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Intensidad del Viento
                      </div>
                      <div className="relative h-16 bg-white/5 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-end space-x-1 p-2">
                          {[...Array(12)].map((_, i) => {
                            const height = Math.random() * 80 + 20;
                            const isHigh = height > 60;
                            return (
                              <div key={i} className={`flex-1 rounded-t ${
                                isHigh ? 'bg-gradient-to-t from-red-500 to-orange-400' : 'bg-gradient-to-t from-green-500 to-green-400'
                              }`} style={{ height: `${height}%` }}></div>
                            );
                          })}
                        </div>
                        <div className="absolute bottom-2 right-2 text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
                          Promedio: {Math.round(results?.stats?.wind10m?.p50 || 6)}m/s
                        </div>
                      </div>
                    </div>

                    {/* Probabilidades de Extremos */}
                    <div>
                      <div className="text-blue-200 text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Análisis de Riesgo
                      </div>
                      <div className="space-y-2">
                        <ProbabilityCards data={results} />
                      </div>
                    </div>

                    {/* Gráfico temporal */}
                    <div>
                      <div className="text-blue-200 text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Tendencia Temporal
                      </div>
                      <div className="h-20 bg-gray-900/80 border border-white/20 rounded-lg p-2 shadow-inner">
                        <TimeSeriesChart data={results} />
                      </div>
                    </div>

                    {/* Información de datos */}
                    <div className="text-center p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-400/20">
                      <div className="text-green-400 text-sm font-semibold">✅ Análisis Completado</div>
                      <div className="text-blue-200 text-sm mt-1">
                        {results?.stats?.t2m?.n_samples || 480} muestras analizadas
                      </div>
                      {results?.adaptationInfo && (
                        <div className="text-yellow-300 text-sm mt-2 font-medium">
                          📊 Región: {results.adaptationInfo.region}
                        </div>
                      )}
                    </div>

                    {/* Información técnica compacta */}
                    {results?.adaptationInfo && (
                      <details className="text-xs">
                        <summary className="text-blue-300 cursor-pointer hover:text-blue-200 font-medium">
                          ℹ️ Detalles técnicos
                        </summary>
                        <div className="mt-2 p-3 bg-black/30 rounded text-blue-200 space-y-1 text-xs">
                          <div>📍 Coordenadas: {results.originalLat?.toFixed(4)}, {results.originalLon?.toFixed(4)}</div>
                          <div>📅 DOY: {results.originalDoy}</div>
                          <div>📏 Distancia: ~{results.adaptationInfo.locationDistance}°</div>
                          <div>📈 Fuente: {results.adaptationInfo.dataSource}</div>
                        </div>
                      </details>
                    )}
                  </div>
                </motion.div>
              </ProximityGlow>
            </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}