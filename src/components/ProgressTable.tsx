import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";

const gradeStyles: Record<number, string> = {
  1: "bg-rose-50 text-rose-600 border-rose-200",
  2: "bg-orange-50 text-orange-600 border-orange-200",
  3: "bg-amber-50 text-amber-600 border-amber-200",
  4: "bg-sky-50 text-sky-600 border-sky-200",
  5: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export const ProgressTable = ({ rows }: { rows: any[] }) => {
  return (
    <section data-testid="progress-table" className="bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-200/70 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100">
        <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <ClipboardList className="h-4.5 w-4.5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Registro de progreso</h3>
          <p className="text-xs text-slate-500">Historial de evaluaciones de la sesión</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-100">
              <TableHead className="text-slate-600 font-semibold">Ejercicio</TableHead>
              <TableHead className="text-slate-600 font-semibold">Fecha</TableHead>
              <TableHead className="text-slate-600 font-semibold">Tiempo sostenido</TableHead>
              <TableHead className="text-slate-600 font-semibold text-right">Grado de escala</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-testid={`progress-row-${row.id}`} className="border-slate-100">
                <TableCell className="font-medium text-slate-800">{row.exercise}</TableCell>
                <TableCell className="text-slate-500">{row.date}</TableCell>
                <TableCell className="font-clock text-slate-700">{row.time}</TableCell>
                <TableCell className="text-right">
                  <span className={`inline-flex items-center justify-center min-w-[2.75rem] rounded-full border px-2.5 py-1 text-xs font-semibold ${gradeStyles[row.grade]}`}>
                    {row.grade} / 5
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
