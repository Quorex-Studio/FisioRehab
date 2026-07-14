import { Smile, Eye, ChevronsUp, Frown, Wind, CircleDot, type LucideIcon } from "lucide-react";
import { EXERCISES, type ExerciseId } from "@/data/exercises";

const ICONS: Record<string, LucideIcon> = {
  Smile,
  Eye,
  ChevronsUp,
  Frown,
  Wind,
  CircleDot,
};

export const ExerciseCards = ({
  selected,
  onSelect,
}: {
  selected: ExerciseId;
  onSelect: (id: ExerciseId) => void;
}) => {
  return (
    <section data-testid="exercise-cards" className="bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-200/70 p-6 flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Tarjetas de evaluación</h3>
        <span className="text-xs font-medium text-slate-400">Elige la condición a evaluar</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EXERCISES.map((ex) => {
          const Icon = ICONS[ex.icon];
          const active = selected === ex.id;
          return (
            <button
              key={ex.id}
              data-testid={`exercise-card-${ex.id}`}
              onClick={() => onSelect(ex.id)}
              className={`text-left flex flex-col gap-2 rounded-xl p-3.5 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                active
                  ? "bg-blue-50 border-blue-600 ring-1 ring-blue-600 shadow-sm -translate-y-0.5"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:-translate-y-0.5"
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className={`text-sm font-semibold leading-snug ${active ? "text-blue-800" : "text-slate-800"}`}>{ex.title}</p>
              <p className="text-[11px] text-slate-500 leading-snug">{ex.muscle}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
