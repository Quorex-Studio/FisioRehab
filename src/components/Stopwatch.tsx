import { Play, Square, RotateCcw, Timer } from "lucide-react";

export const Stopwatch = ({ elapsedMs, running, onStart, onStop, onReset }: { elapsedMs: number; running: boolean; onStart: () => void; onStop: () => void; onReset: () => void }) => {
  const totalSeconds = elapsedMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((elapsedMs % 1000) / 100);
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Timer className="h-4 w-4 text-blue-600" />
        Cronómetro clínico
      </div>
      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6 border border-slate-100">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 mb-3 ${running ? "text-blue-700 bg-blue-100" : "text-slate-500 bg-slate-200/70"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-blue-600 animate-pulse" : "bg-slate-400"}`} />
          {running ? "Midiendo…" : "En espera"}
        </span>
        <div data-testid="timer-display" className="font-clock text-5xl sm:text-6xl font-semibold tracking-tight text-slate-900">{display}</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button data-testid="start-timer" onClick={onStart} disabled={running} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          <Play className="h-4 w-4" fill="currentColor" />
          Iniciar
        </button>
        <button data-testid="stop-timer" onClick={onStop} disabled={!running} className="inline-flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
          <Square className="h-4 w-4" fill="currentColor" />
          Detener
        </button>
        <button data-testid="reset-timer" onClick={onReset} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2">
          <RotateCcw className="h-4 w-4" />
          Reiniciar
        </button>
      </div>
    </div>
  );
};
