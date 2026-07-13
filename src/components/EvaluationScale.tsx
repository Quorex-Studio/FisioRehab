const SCALE = [
  { value: 1, label: "Sin movimiento" },
  { value: 2, label: "Leve" },
  { value: 3, label: "Moderado" },
  { value: 4, label: "Bueno" },
  { value: 5, label: "Completo" },
];

export const EvaluationScale = ({ selected, onSelect }: { selected: number | null; onSelect: (value: number) => void }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Escala de evaluación</span>
        <span className="text-xs font-medium text-slate-400">Grado 1 – 5</span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {SCALE.map((item) => {
          const active = selected === item.value;
          return (
            <button
              key={item.value}
              data-testid={`scale-option-${item.value}`}
              onClick={() => onSelect(item.value)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${active ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 -translate-y-0.5 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:-translate-y-0.5"}`}
            >
              <span className="text-xl font-bold leading-none">{item.value}</span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
        <span>1 · Sin movimiento</span>
        <span>5 · Movimiento completo</span>
      </div>
    </div>
  );
};
