import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ClipboardCheck, Stethoscope, PlayCircle, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { ArViewer } from "@/components/ArViewer";
import { Stopwatch } from "@/components/Stopwatch";
import { EvaluationScale } from "@/components/EvaluationScale";
import { ProgressTable } from "@/components/ProgressTable";
import { ResourcesGrid } from "@/components/ResourcesGrid";
import { ExerciseCards } from "@/components/ExerciseCards";
import { EXERCISES, type ExerciseId } from "@/data/exercises";

const INITIAL_ROWS = [
  { id: 1, exercise: "Cerrar párpado", date: "10 jun 2026", time: "00:04.5", grade: 3 },
  { id: 2, exercise: "Elevar cejas", date: "10 jun 2026", time: "00:06.2", grade: 4 },
  { id: 3, exercise: "Simular sonrisa", date: "12 jun 2026", time: "00:03.8", grade: 2 },
];

const formatTime = (ms: number) => {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
};

export default function Dashboard() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [scale, setScale] = useState<number | null>(null);
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [activeExerciseId, setActiveExerciseId] = useState<ExerciseId>("sonrisa");
  const [guidedMode, setGuidedMode] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);

  const activeExercise = EXERCISES.find((e) => e.id === activeExerciseId) ?? EXERCISES[0];

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startStampRef = useRef(0);
  const baseRef = useRef(0);

  const stopTicking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => stopTicking, [stopTicking]);

  const handleStart = () => {
    if (running) return;
    startStampRef.current = performance.now();
    baseRef.current = elapsed;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(baseRef.current + (performance.now() - startStampRef.current));
    }, 50);
  };

  const handleStop = () => {
    stopTicking();
    setRunning(false);
  };

  const handleReset = () => {
    stopTicking();
    setRunning(false);
    setElapsed(0);
  };

  const handleRecord = () => {
    if (elapsed === 0) {
      toast.error("Inicia el cronómetro antes de registrar la evaluación.");
      return;
    }
    if (!scale) {
      toast.error("Selecciona un grado en la escala de evaluación (1–5).");
      return;
    }
    stopTicking();
    setRunning(false);
    const newRow = {
      id: Date.now(),
      exercise: activeExercise.title,
      date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      time: formatTime(elapsed),
      grade: scale,
    };
    setRows((prev) => [newRow, ...prev]);
    toast.success("Evaluación registrada", {
      description: `${activeExercise.title} · ${newRow.time} · Grado ${scale}/5`,
    });
    setScale(null);
    setElapsed(0);

    if (guidedMode) {
      const nextIndex = guidedIndex + 1;
      if (nextIndex < EXERCISES.length) {
        setGuidedIndex(nextIndex);
        setActiveExerciseId(EXERCISES[nextIndex].id);
        toast.info(`Siguiente ejercicio guiado: ${EXERCISES[nextIndex].title}`);
      } else {
        setGuidedMode(false);
        toast.success("Rutina guiada completada", {
          description: "Se evaluaron todos los ejercicios de la secuencia.",
        });
      }
    }
  };

  const startGuidedRoutine = () => {
    setGuidedMode(true);
    setGuidedIndex(0);
    setActiveExerciseId(EXERCISES[0].id);
    setScale(null);
    handleReset();
    toast.info("Rutina guiada iniciada", {
      description: `Ejercicio 1 de ${EXERCISES.length}: ${EXERCISES[0].title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-between gap-2 mb-6 animate-fade-up flex-wrap">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-slate-500">
              Consultorio · <span className="font-medium text-slate-700">Paciente: M. Rossi</span> · Sesión de rehabilitación facial
            </p>
          </div>
          {!guidedMode ? (
            <button
              data-testid="start-guided-routine"
              onClick={startGuidedRoutine}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Iniciar rutina guiada ({EXERCISES.length} ejercicios)
            </button>
          ) : (
            <div data-testid="guided-progress" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              Guiado: paso {guidedIndex + 1} de {EXERCISES.length}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ArViewer exerciseTitle={activeExercise.title} exerciseInstruction={activeExercise.instruction} activeExerciseId={activeExerciseId} />
            <ExerciseCards selected={activeExerciseId} onSelect={(id) => { setActiveExerciseId(id); setGuidedMode(false); }} />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <section
              data-testid="clinical-area"
              className="bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-200/70 p-6 flex flex-col gap-6 animate-fade-up"
              style={{ animationDelay: "0.08s" }}
            >
              <Stopwatch elapsedMs={elapsed} running={running} onStart={handleStart} onStop={handleStop} onReset={handleReset} />
              <div className="h-px bg-slate-100" />
              <EvaluationScale selected={scale} onSelect={setScale} />
              <button
                data-testid="record-evaluation-btn"
                onClick={handleRecord}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 text-base font-semibold shadow-sm shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <ClipboardCheck className="h-5 w-5" />
                Registrar evaluación
              </button>
            </section>
          </div>

          <div className="lg:col-span-12 flex flex-col gap-8 mt-2">
            <ProgressTable rows={rows} />
            <ResourcesGrid />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xs text-slate-400">
          FacioRehab · Prototipo clínico de rehabilitación de parálisis facial · Datos ilustrativos
        </p>
      </footer>
    </div>
  );
}
