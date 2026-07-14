import { useState } from "react";
import { Info } from "lucide-react";
import { SCALE_GRADES } from "@/data/exercises";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

// Barras de amplitud: representación visual simple del grado de movimiento (0 a 5 segmentos activos)
const AmplitudeBars = ({ level, active }: { level: number; active: boolean }) => (
  <div className="flex items-end gap-0.5 h-4">
    {[1, 2, 3, 4, 5].map((bar) => (
      <span
        key={bar}
        className={`w-1 rounded-sm transition-colors ${bar <= level ? (active ? "bg-blue-600" : "bg-slate-400") : "bg-slate-200"}`}
        style={{ height: `${bar * 3}px` }}
      />
    ))}
  </div>
);

export const EvaluationScale = ({ selected, onSelect }: { selected: number | null; onSelect: (value: number) => void }) => {
  const [detailOpen, setDetailOpen] = useState<number | null>(null);
  const detailGrade = SCALE_GRADES.find((g) => g.value === detailOpen);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Escala de evaluación</span>
        <span className="text-xs font-medium text-slate-400">Grado 1 – 5</span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {SCALE_GRADES.map((item) => {
          const active = selected === item.value;
          return (
            <button
              key={item.value}
              data-testid={`scale-option-${item.value}`}
              onClick={() => onSelect(item.value)}
              className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl py-3 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${active ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 -translate-y-0.5 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:-translate-y-0.5"}`}
            >
              <span
                data-testid={`scale-info-${item.value}`}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailOpen(item.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    setDetailOpen(item.value);
                  }
                }}
                className="absolute top-1 right-1 text-slate-300 hover:text-blue-500"
              >
                <Info className="h-3 w-3" />
              </span>
              <AmplitudeBars level={item.value} active={active} />
              <span className="text-xl font-bold leading-none">{item.value}</span>
              <span className="text-[10px] font-medium leading-none text-center px-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
        <span>1 · Sin movimiento</span>
        <span>5 · Movimiento completo</span>
      </div>

      <Dialog open={detailOpen !== null} onOpenChange={(open) => !open && setDetailOpen(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          {detailGrade && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-slate-900">
                  <AmplitudeBars level={detailGrade.value} active={true} />
                  Grado {detailGrade.value} · {detailGrade.label}
                </DialogTitle>
                <DialogDescription className="text-slate-600 leading-relaxed pt-2">
                  {detailGrade.description}
                </DialogDescription>
              </DialogHeader>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Ejemplo: </span>
                {detailGrade.example}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
