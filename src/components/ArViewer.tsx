import { useRef, useState, useEffect, type MouseEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Camera, Smile, Sparkles, Rotate3d, Smartphone, ScanLine } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { AnatomyHotspots } from "@/components/AnatomyHotspots";

const MODEL_SRC = "/models/face.glb";
const ModelViewer = "model-viewer" as any;

interface ArViewerProps {
  exerciseTitle?: string;
  exerciseInstruction?: string;
}

const detectMobile = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const touch =
    navigator.maxTouchPoints > 1 &&
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;
  return uaMobile || touch;
};

export const ArViewer = ({ exerciseTitle, exerciseInstruction }: ArViewerProps) => {
  const viewerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [anatomyGroup, setAnatomyGroup] = useState<"none" | "muscle" | "nerve">("none");
  const [calibrating, setCalibrating] = useState(false);

  useEffect(() => {
    setIsMobile(detectMobile());
    setPageUrl(window.location.href);
  }, []);

  const handleModelClick = async (e: MouseEvent<HTMLElement>) => {
    if (!calibrating) return;
    const mv: any = viewerRef.current;
    if (!mv || typeof mv.positionAndNormalFromPoint !== "function") return;
    const rect = mv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = mv.positionAndNormalFromPoint(x, y);
    if (!hit) {
      toast.error("No se detectó el modelo en ese punto, intenta de nuevo.");
      return;
    }
    const posStr = `${hit.position.x.toFixed(2)} ${hit.position.y.toFixed(2)} ${hit.position.z.toFixed(2)}`;
    const normStr = `${hit.normal.x.toFixed(2)} ${hit.normal.y.toFixed(2)} ${hit.normal.z.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(`position="${posStr}" normal="${normStr}"`);
      toast.success("Coordenadas copiadas", { description: `position: ${posStr} · normal: ${normStr}` });
    } catch {
      toast.info("Coordenadas obtenidas", { description: `position: ${posStr} · normal: ${normStr}` });
    }
    // eslint-disable-next-line no-console
    console.log("[Calibración RA]", { position: posStr, normal: normStr });
  };

  const handleAR = () => {
    if (isMobile) {
      const mv: any = viewerRef.current;
      if (mv && mv.canActivateAR) {
        mv.activateAR();
      } else {
        toast.info("Preparando Realidad Aumentada…", {
          description: "Tu dispositivo aún está cargando el visor 3D o no soporta RA. Inténtalo de nuevo en unos segundos.",
        });
      }
    } else {
      setQrOpen(true);
    }
  };

  return (
    <section data-testid="ar-exercise-card" className="bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-200/70 p-6 flex flex-col animate-fade-up">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 mb-2.5">
            <Sparkles className="h-3.5 w-3.5" />
            Ejercicio activo
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{exerciseTitle ?? "Simular sonrisa"}</h2>
          <p className="text-sm text-slate-500 mt-1.5 max-w-md leading-relaxed">
            {exerciseInstruction ?? "Eleva de forma simétrica ambas comisuras de los labios y mantén la posición. Observa el modelo y replica el movimiento frente al espejo."}
          </p>
        </div>
        <div className="hidden sm:flex h-12 w-12 shrink-0 rounded-xl bg-slate-900 items-center justify-center">
          <Smile className="h-6 w-6 text-blue-400" />
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-800 aspect-video">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.2), transparent 50%)",
        }} />
        <ModelViewer
          ref={viewerRef}
          src={MODEL_SRC}
          alt="Modelo anatómico 3D de rostro para rehabilitación facial"
          camera-controls=""
          auto-rotate={anatomyGroup === "none" ? "" : undefined}
          auto-rotate-delay="800"
          rotation-per-second="16deg"
          ar=""
          ar-modes="webxr scene-viewer quick-look"
          environment-image="neutral"
          shadow-intensity="0.6"
          exposure="1.15"
          interaction-prompt="none"
          onClick={handleModelClick}
          style={{ position: "absolute", inset: 0, cursor: calibrating ? "crosshair" : undefined }}
        >
          <AnatomyHotspots visibleGroup={anatomyGroup} />
        </ModelViewer>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-200 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
          <Rotate3d className="h-3.5 w-3.5 text-blue-300" />
          Modelo anatómico · WebAR
        </div>
        <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-300 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
          Arrastra para rotar
        </div>
        <div data-testid="device-badge" className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-200 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
          <Smartphone className="h-3.5 w-3.5 text-blue-300" />
          {isMobile ? "Móvil · RA lista" : "Escritorio"}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-[11px] font-semibold text-slate-500 mr-1">Capa anatómica:</span>
        <button
          data-testid="anatomy-toggle-none"
          onClick={() => setAnatomyGroup("none")}
          className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${anatomyGroup === "none" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
        >
          Ninguna
        </button>
        <button
          data-testid="anatomy-toggle-muscle"
          onClick={() => setAnatomyGroup("muscle")}
          className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${anatomyGroup === "muscle" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"}`}
        >
          Músculos
        </button>
        <button
          data-testid="anatomy-toggle-nerve"
          onClick={() => setAnatomyGroup("nerve")}
          className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${anatomyGroup === "nerve" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-slate-600 border-slate-200 hover:border-yellow-400"}`}
        >
          Nervio facial
        </button>
        <button
          data-testid="calibration-toggle"
          onClick={() => setCalibrating((v) => !v)}
          title="Modo calibración: clic sobre el modelo para copiar la posición exacta"
          className={`ml-auto text-[11px] font-medium rounded-full px-3 py-1.5 border transition-colors ${calibrating ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"}`}
        >
          {calibrating ? "Calibrando…" : "Modo calibración"}
        </button>
      </div>

      <button data-testid="ar-button" onClick={handleAR} className="mt-4 w-full inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 pulse-ring">
        <Camera className="h-5 w-5 text-blue-400" />
        {isMobile ? "Ver en tu espacio en RA" : "Ver en RA (escanear con móvil)"}
      </button>
      <p className="text-[11px] text-slate-400 text-center mt-2">
        {isMobile
          ? "Se abrirá la cámara de tu dispositivo para proyectar el modelo 3D. Las capas de músculos/nervio también se ven dentro de la sesión de RA."
          : "La Realidad Aumentada requiere un móvil o tablet. Escanea el código QR para abrirlo allí."}
      </p>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent data-testid="qr-dialog" className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <ScanLine className="h-5 w-5 text-blue-600" />
              Abrir en tu móvil
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Escanea este código QR con la cámara de tu teléfono o tablet para abrir FacioRehab y ver el modelo en Realidad Aumentada.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              {pageUrl && <QRCodeSVG value={pageUrl} size={196} level="M" fgColor="#0f172a" data-testid="qr-code" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Smartphone className="h-4 w-4 text-blue-600" />
              Compatible con Android (Scene Viewer) e iOS (Quick Look)
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
