# Skylikely-PixelStorm
# Rama de desarrollo para la parte de front


Instalacion
# Node 20+
npm create vite@latest weather-likelihood-frontend -- --template react
cd weather-likelihood-frontend
npm i react-leaflet leaflet chart.js react-chartjs-2 zustand tailwindcss postcss autoprefixer dayjs papaparse
npx tailwindcss init -p

Por qué cada dependencia

Vite: dev server instantáneo y build simple.

React: componentes reutilizables, estado claro.

Leaflet/react-leaflet: mapas sin vendor lock-in ni claves.

Chart.js: charts suficientes para MVP.

Zustand: estado global sin boilerplate.

Tailwind: estilos utilitarios, sin CSS pesado.

dayjs: utilidades de fecha compactas.

Papa Parse: carga CSV desde /public/data.

(Workbox): cachear /public/data para demo, opcional.