import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, RotateCcw, Timer } from 'lucide-react';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const toggle = useCallback(() => setIsRunning((r) => !r), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-panel p-6 flex flex-col items-center justify-center gap-6 relative overflow-hidden transition-all duration-300 ${isRunning ? 'ring-2 ring-primary/50 bg-white/80' : ''}`}>
      {/* Indicador animado de estado activo */}
      {isRunning && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-slow shadow-[0_0_8px_rgba(5,150,105,0.8)]"></div>
          <span className="text-xs text-primary font-semibold tracking-wider">REC</span>
        </div>
      )}

      <div className="flex items-center gap-3 text-slate-800">
        <Timer className="w-6 h-6 text-slate-400" />
        <div className="font-mono text-5xl font-light tracking-tight">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-white ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-emerald-700'}`}
        >
          {isRunning ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-sm transition-transform hover:scale-105 active:scale-95"
          disabled={time === 0 && !isRunning}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
