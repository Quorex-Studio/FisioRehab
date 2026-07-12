import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { useClinicalStore } from '../../store/useClinicalStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const ProgressTable: React.FC = () => {
  const { evaluationLogs } = useClinicalStore();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 1: return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 2: return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 3: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 4: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 5: return 'text-emerald-300 bg-emerald-400/20 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="glass-panel p-6 pointer-events-auto max-w-lg w-full flex flex-col gap-4 max-h-[500px] overflow-hidden flex-shrink-0">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white leading-tight">Registro Clínico</h3>
          <p className="text-sm text-slate-400">Telemetría de ejercicios faciales</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {evaluationLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm italic py-10">
            No hay registros en esta sesión.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {[...evaluationLogs].reverse().map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {log.exercise === 'Smile' ? 'Sonrisa' : 
                       log.exercise === 'Close_Eyes' ? 'Oclusión Ocular' : 
                       'Elevación Frontal'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm text-slate-300">
                      {formatTime(log.timeElapsed)}
                    </div>
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded border font-bold",
                      getGradeColor(log.grade)
                    )}>
                      {log.grade}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
