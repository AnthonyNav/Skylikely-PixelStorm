import { motion } from "framer-motion";
import ProximityGlow from "@components/ui/ProximityGlow.jsx";
import LottieBackground from "@components/ui/LottieBackground.jsx";

export default function WelcomePage({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Lottie weather animations background */}
      <LottieBackground />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Header with logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="mb-16"
          >
            {/* Logo with glow effect */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-3xl blur-xl opacity-60 animate-pulse" />
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
            </div>
            
            {/* Main heading with gradient text */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Sky
              </span>
              <span className="text-white">likely</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
              Revoluciona tu comprensión del clima con análisis probabilísticos avanzados 
              para cualquier ubicación del planeta
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto items-stretch"
          >
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Ubicación Inteligente",
                description: "Planea tu boda, picnic o día de playa sin sorpresas. Selecciona tu ubicación y descubre cómo puede jugarte el clima.",
                gradient: "from-blue-500/20 to-blue-600/20",
                iconColor: "text-blue-400",
                delay: 0.5
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Análisis Temporal",
                description: "¿Vacaciones en verano o un hike en otoño? Ajusta la fecha y mira qué tan probable es tener sol, lluvia o calor extremo.",
                gradient: "from-purple-500/20 to-purple-600/20",
                iconColor: "text-purple-400",
                delay: 0.6
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Insights Probabilísticos",
                description: "No adivines: recibe porcentajes claros de riesgo climático para decidir si reprogramar, llevar paraguas o disfrutar sin preocupaciones.",
                gradient: "from-cyan-500/20 to-cyan-600/20",
                iconColor: "text-cyan-400",
                delay: 0.7
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                className="group relative"
              >
                <ProximityGlow className="rounded-2xl h-full" c1="rgba(59,130,246,0.2)" c2="rgba(168,85,247,0.15)">
                  <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 h-full min-h-[320px] transition-all duration-500 group-hover:border-slate-700/50 flex flex-col">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                      <div className={`w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6 ${feature.iconColor} group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors flex-shrink-0">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors flex-grow flex items-center">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </ProximityGlow>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <ProximityGlow 
              className="rounded-3xl inline-block" 
              c1="rgba(59,130,246,0.5)" 
              c2="rgba(168,85,247,0.4)" 
              radius={300} 
              intensity={0.6}
            >
              <button
                onClick={onStart}
                className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Button content */}
                <span className="relative z-10 flex items-center space-x-4">
                  <span>Comenzar Análisis</span>
                  <motion.svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </button>
            </ProximityGlow>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Demo en vivo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Datos precomputados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Sin registro requerido</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </div>
  );
}