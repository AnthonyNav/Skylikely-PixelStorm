import MapView from "@components/MapView.jsx";
import Controls from "@components/Controls.jsx";
import ProbabilityCards from "@components/ProbabilityCards.jsx";
import TimeSeriesChart from "@components/TimeSeriesChart.jsx";
import { useAppStore } from "@store/useAppStore.js";

export default function App() {
  const { data, loading } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Skylikely</h1>
          <nav className="text-sm text-slate-500">Demo sin backend</nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="h-[420px] lg:h-[520px] rounded-2xl overflow-visible border bg-white">
            <MapView />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-4"><Controls /></div>
            <div className="rounded-2xl border bg-white p-4">
              {loading ? "Procesando…" : <ProbabilityCards data={data} />}
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <TimeSeriesChart data={data} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-slate-500">
          Datos de ejemplo precomputados. Mapas © OpenStreetMap contributors.
        </div>
      </footer>
    </div>
  );
}
