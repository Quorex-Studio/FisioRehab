import { Camera } from "lucide-react";

export const FaceMirror = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-slate-400">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border border-slate-700 animate-pulse">
        <Camera className="h-6 w-6 text-slate-500" />
      </div>
      <p className="text-sm font-medium">Iniciando cámara frontal...</p>
    </div>
  );
};
