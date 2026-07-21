import { useEffect, useRef, useState } from "react";
import { CameraOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const FaceMirror = ({ active }: { active: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!active) return;
    
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        setLoading(true);
        setError(false);
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" },
          audio: false
        });
        
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (isMounted) {
          setError(true);
          toast.error("No se pudo acceder a la cámara", {
            description: "Verifica que hayas dado los permisos necesarios en tu navegador."
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-900/80 backdrop-blur-sm text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Iniciando cámara frontal...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-900/90 text-rose-400">
          <div className="h-16 w-16 rounded-full bg-rose-950/50 flex items-center justify-center border border-rose-900/50">
            <CameraOff className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-center px-6">
            Acceso a la cámara denegado.<br/>
            <span className="text-xs text-slate-500">Otorga permisos en la configuración de tu navegador.</span>
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover scale-x-[-1]"
        onLoadedData={() => setLoading(false)}
      />
    </div>
  );
};
