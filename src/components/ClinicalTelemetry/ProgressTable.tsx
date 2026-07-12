import React from 'react';
import { ClipboardList } from 'lucide-react';

interface SessionRecord {
  id: string;
  exercise: string;
  sustainedTime: string;
  sunnybrookGrade: number;
}

const mockData: SessionRecord[] = [
  { id: '1', exercise: 'Elevación Frontal (Reposo)', sustainedTime: '00:15.50', sunnybrookGrade: 85 },
  { id: '2', exercise: 'Cierre Ocular Suave', sustainedTime: '00:30.00', sunnybrookGrade: 60 },
  { id: '3', exercise: 'Sonrisa (Boca Abierta)', sustainedTime: '00:45.20', sunnybrookGrade: 40 },
  { id: '4', exercise: 'Fruncido Labial', sustainedTime: '00:10.10', sunnybrookGrade: 95 },
];

export const ProgressTable: React.FC = () => {
  const getBadgeColor = (grade: number) => {
    if (grade >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (grade >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg pb-2 border-b border-slate-100">
        <ClipboardList className="w-5 h-5 text-secondary" />
        Registro de Sesión
      </div>
      
      <div className="w-full overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 font-medium rounded-tl-lg">Ejercicio</th>
              <th className="px-4 py-3 font-medium">Tiempo Sostenido</th>
              <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Grado Sunnybrook</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((record, idx) => (
              <tr key={record.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx === mockData.length - 1 ? 'border-0' : ''}`}>
                <td className="px-4 py-4 font-medium text-slate-700">{record.exercise}</td>
                <td className="px-4 py-4 text-slate-500 font-mono">{record.sustainedTime}</td>
                <td className="px-4 py-4 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(record.sunnybrookGrade)}`}>
                    {record.sunnybrookGrade} pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
