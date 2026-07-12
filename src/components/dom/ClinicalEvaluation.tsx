import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RotateCcw, Activity } from 'lucide-react';
import { useClinicalStore, type ClinicalExercise } from '../../store/useClinicalStore';
import { MagneticButton } from './MagneticButton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const EXERCISES: { id: ClinicalExercise; label: string }[] = [
  { id: 'Smile', label: 'Sonreír' },
  { id: 'Close_Eyes', label: 'Cerrar Ojos' },
  { id: 'Raise_Eyebrows', label: 'Elevar Cejas' },
];

export const ClinicalEvaluation: React.FC = () => {
  const { 
    activeExercise, setActiveExercise, 
    stopwatchTime, setStopwatchTime, 
    sunnybrookGrade, setSunnybrookGrade,
    recordEvaluation
  } = useClinicalStore();

  const [isRunning, setIsRunning] = useState(false);

  // Stopwatch Logic
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setStopwatchTime(stopwatchTime + 10);
      }, 10);
    } else {
      window.clearInterval(interval!);
    }
    return () => window.clearInterval(interval);
  }, [isRunning, stopwatchTime, setStopwatchTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  const handleExerciseClick = (exerciseId: ClinicalExercise) => {
    setActiveExercise(activeExercise === exerciseId ? 'Rest' : exerciseId);
    setIsRunning(false);
    setStopwatchTime(0);
    setSunnybrookGrade(1);
  };

  // Escala Sunnybrook colors (semantic, independent of theme)
  const gradeColors: Record<number, string> = {
    1: 'bg-red-500/20 text-red-400 border-red-500/50',
    2: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    4: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    5: 'bg-emerald-400/30 text-emerald-300 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)]',
  };

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel pointer-events-auto max-w-md w-full">
      
      {/* Tarjetas de Ejercicios */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Protocolo Clínico
        </h3>
        <div className="flex flex-col gap-3">
          {EXERCISES.map((exercise) => {
            const isActive = activeExercise === exercise.id;
            return (
              <motion.button
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise.id)}
                className={cn(
                  "relative w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 overflow-hidden",
                  isActive 
                    ? "bg-primary/20 border-primary/50 text-white" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeExerciseBg"
                    className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent -z-10"
                  />
                )}
                <span className="font-semibold text-lg relative z-10">{exercise.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeExercise && activeExercise !== 'Rest' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Stopwatch */}
            <div className="flex flex-col items-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/5">
              <div className={cn(
                "text-5xl font-mono tracking-wider font-bold transition-colors duration-300",
                isRunning ? "text-primary drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" : "text-white"
              )}>
                {formatTime(stopwatchTime)}
              </div>
              <div className="flex gap-4">
                <MagneticButton 
                  onClick={() => setIsRunning(!isRunning)}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full transition-all",
                    isRunning ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-primary/20 text-primary border-primary/30 hover:bg-primary/40"
                  )}
                >
                  {isRunning ? <Square className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
                </MagneticButton>
                <MagneticButton 
                  onClick={() => { setIsRunning(false); setStopwatchTime(0); }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-slate-300 border-white/20 hover:bg-white/20"
                >
                  <RotateCcw className="w-5 h-5" />
                </MagneticButton>
              </div>
            </div>

            {/* Sunnybrook Scale */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                <span>Escala Sunnybrook</span>
                <span>(1: Pobre - 5: Normal)</span>
              </div>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <MagneticButton
                    key={grade}
                    onClick={() => setSunnybrookGrade(grade)}
                    className={cn(
                      "flex-1 h-12 rounded-lg font-bold text-lg border transition-all duration-300",
                      sunnybrookGrade === grade 
                        ? gradeColors[grade] 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    {grade}
                  </MagneticButton>
                ))}
              </div>
            </div>

            <MagneticButton 
              onClick={() => {
                recordEvaluation();
                setIsRunning(false);
              }}
              className="w-full bg-gradient-to-r from-primary to-sky-400 text-white font-bold py-4 rounded-xl text-lg mt-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              REGISTRAR EVALUACIÓN
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
