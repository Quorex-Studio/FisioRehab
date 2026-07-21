import { useRef, useState, useEffect, type MouseEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Camera, Smile, Sparkles, Rotate3d, Smartphone, ScanLine, ScanFace, Box, Download, Loader2, Wand2, Square, Maximize } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { AnatomyHotspots, ANATOMY_HOTSPOTS } from "@/components/AnatomyHotspots";
import { FaceMirror } from "@/components/FaceMirror";
import { EXERCISE_HOTSPOT_MAP } from "@/data/exerciseSimulation";
import type { ExerciseId } from "@/data/exercises";

const MODEL_SRC = "/models/face.glb";
const ModelViewer = "model-viewer" as any;

interface ArViewerProps {
  exerciseTitle?: string;
  exerciseInstruction?: string;
  activeExerciseId?: ExerciseId;
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

const detectInAppBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Los navegadores embebidos de redes sociales bloquean WebXR/Quick Look.
  return /FBAN|FBAV|Instagram|Line\/|WhatsApp|TikTok|Twitter/i.test(ua);
};

export const ArViewer = ({ exerciseTitle, exerciseInstruction, activeExerciseId }: ArViewerProps) => {
  const viewerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [anatomyGroup, setAnatomyGroup] = useState<"none" | "muscle" | "nerve">("none");
  const [calibrating, setCalibrating] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [insecureContext, setInsecureContext] = useState(false);
  const [viewMode, setViewMode] = useState<"model" | "mirror">("model");
  const [modelProgress, setModelProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [activation, setActivation] = useState<Record<string, number>>({});
  const [simulating, setSimulating] = useState(false);
  const simulationCancelRef = useRef(false);

  useEffect(() => {
    setIsMobile(detectMobile());
    setPageUrl(window.location.href);
    setInAppBrowser(detectInAppBrowser());
    // WebXR y Quick Look exigen contexto seguro (https, o localhost en dev).
    setInsecureContext(typeof window !== "undefined" && window.isSecureContext === false);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen().catch(() => {
        toast.error("No se pudo activar la pantalla completa");
      });
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };


  // Diagnóstico: <model-viewer> emite eventos reales cuando algo falla.
  // Sin esto, un fallo de carga o de AR se queda en silencio para el usuario.
  useEffect(() => {
    const mv: any = viewerRef.current;
    if (!mv) return;

    const onModelError = (ev: any) => {
      // eslint-disable-next-line no-console
      console.error("[RA] Error cargando el modelo 3D:", ev?.detail);
      toast.error("No se pudo cargar el modelo 3D", {
        description: "Revisa que /models/face.glb exista y que la ruta sea accesible en este entorno.",
      });
    };
    const onProgress = (ev: any) => {
      const fraction = ev?.detail?.totalProgress ?? 0;
      setModelProgress(Math.round(fraction * 100));
    };
    const onLoad = () => setModelReady(true);
    const onArStatus = (ev: any) => {
      const status = ev?.detail?.status;
      // eslint-disable-next-line no-console
      console.log("[RA] ar-status:", status);
      if (status === "failed") {
        toast.error("La sesión de RA no pudo iniciarse", {
          description: "Verifica permisos de cámara, que uses Safari/Chrome (no una app como Instagram/WhatsApp) y que el sitio use HTTPS.",
        });
      }
      if (status === "object-placed" && "vibrate" in navigator) {
        navigator.vibrate?.(35);
      }
    };

    mv.addEventListener("error", onModelError);
    mv.addEventListener("progress", onProgress);
    mv.addEventListener("load", onLoad);
    mv.addEventListener("ar-status", onArStatus);
    return () => {
      mv.removeEventListener("error", onModelError);
      mv.removeEventListener("progress", onProgress);
      mv.removeEventListener("load", onLoad);
      mv.removeEventListener("ar-status", onArStatus);
    };
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

  const activationRef = useRef<Record<string, number>>({});

  const updateActivation = (patch: Record<string, number>) => {
    activationRef.current = { ...activationRef.current, ...patch };
    setActivation(activationRef.current);
  };

  const flyToHotspots = (ids: string[]) => {
    const mv: any = viewerRef.current;
    if (!mv) return;
    const points = ids.map((id) => ANATOMY_HOTSPOTS.find((h) => h.id === id)).filter(Boolean) as typeof ANATOMY_HOTSPOTS;
    if (!points.length) return;
    const sum = points.reduce(
      (acc, h) => {
        const [x, y, z] = h.position.split(" ").map(Number);
        return { x: acc.x + x, y: acc.y + y, z: acc.z + z };
      },
      { x: 0, y: 0, z: 0 },
    );
    const n = points.length;
    // model-viewer anima suavemente estos cambios por sí solo (SmoothControls).
    mv.cameraTarget = `${(sum.x / n).toFixed(2)}m ${(sum.y / n).toFixed(2)}m ${(sum.z / n).toFixed(2)}m`;
    try {
      const current = mv.getCameraOrbit?.();
      if (current) {
        const thetaDeg = (current.theta * 180) / Math.PI;
        const phiDeg = (current.phi * 180) / Math.PI;
        const radius = Math.max(current.radius * 0.55, 1.2);
        mv.cameraOrbit = `${thetaDeg.toFixed(1)}deg ${phiDeg.toFixed(1)}deg ${radius.toFixed(2)}m`;
      }
    } catch {
      // si falla, el cameraTarget por sí solo ya reencuadra de forma razonable
    }
  };

  const animateActivation = (ids: string[], target: number, durationMs: number, cancelRef: { current: boolean }) =>
    new Promise<void>((resolve) => {
      const start = performance.now();
      const startValues = { ...activationRef.current };
      const step = (now: number) => {
        if (cancelRef.current) return resolve();
        const t = Math.min(1, (now - start) / durationMs);
        const patch: Record<string, number> = {};
        ids.forEach((id) => {
          const from = startValues[id] ?? 0;
          patch[id] = from + (target - from) * t;
        });
        updateActivation(patch);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });

  const runSimulation = async () => {
    if (!activeExerciseId) return;
    const ids = EXERCISE_HOTSPOT_MAP[activeExerciseId];
    if (!ids?.length) {
      toast.info("Este ejercicio todavía no tiene un músculo calibrado en el modelo 3D.");
      return;
    }
    setAnatomyGroup("muscle");
    flyToHotspots(ids);
    simulationCancelRef.current = false;
    setSimulating(true);

    const cancelRef = simulationCancelRef;
    for (let rep = 0; rep < 3; rep++) {
      if (cancelRef.current) break;
      await animateActivation(ids, 100, 650, cancelRef);
      if (cancelRef.current) break;
      await new Promise((r) => setTimeout(r, 1400));
      if (cancelRef.current) break;
      await animateActivation(ids, 0, 650, cancelRef);
      if (cancelRef.current) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    setSimulating(false);
  };

  const stopSimulation = () => {
    simulationCancelRef.current = true;
    setSimulating(false);
    if (activeExerciseId) {
      const ids = EXERCISE_HOTSPOT_MAP[activeExerciseId] ?? [];
      updateActivation(Object.fromEntries(ids.map((id: string) => [id, 0])));
    }
  };

  // Si el ejercicio activo cambia (o el componente se desmonta), corta cualquier simulación en curso.
  useEffect(() => {
    return () => {
      simulationCancelRef.current = true;
    };
  }, [activeExerciseId]);

  const handleScreenshot = () => {
    const mv: any = viewerRef.current;
    if (!mv || typeof mv.toDataURL !== "function") {
      toast.error("La captura aún no está lista, espera a que cargue el modelo.");
      return;
    }
    const dataUrl = mv.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `facio-rehab-${Date.now()}.png`;
    link.click();
    toast.success("Captura guardada");
  };

  const handleAR = () => {
    if (insecureContext) {
      toast.error("La Realidad Aumentada requiere HTTPS", {
        description: "Estás accediendo por una conexión no segura (http). Abre el sitio publicado en Vercel (https) o usa localhost en desarrollo.",
      });
      return;
    }
    if (inAppBrowser) {
      toast.error("Abre este enlace en Safari o Chrome", {
        description: "Los navegadores dentro de Instagram/WhatsApp/TikTok no permiten activar la Realidad Aumentada. Toca los tres puntos y elige \"Abrir en el navegador\".",
      });
      return;
    }
    if (isMobile) {
      const mv: any = viewerRef.current;
      if (mv && mv.canActivateAR) {
        mv.activateAR();
      } else {
        toast.info("Preparando Realidad Aumentada…", {
          description: "Tu dispositivo aún está cargando el visor 3D, no soporta RA, o no otorgaste permiso de cámara. Inténtalo de nuevo en unos segundos.",
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

      <div className="flex items-center gap-1.5 mb-4 bg-slate-100 rounded-xl p-1 w-fit" data-testid="ar-mode-tabs">
        <button
          data-testid="mode-tab-model"
          onClick={() => setViewMode("model")}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-colors ${viewMode === "model" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Box className="h-3.5 w-3.5" />
          Modelo 3D (RA)
        </button>
        <button
          data-testid="mode-tab-mirror"
          onClick={() => setViewMode("mirror")}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-colors ${viewMode === "mirror" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <ScanFace className="h-3.5 w-3.5" />
          Espejo en vivo (IA)
        </button>
      </div>

      {(insecureContext || inAppBrowser) && (
        <div data-testid="ar-warning-banner" className="mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold shrink-0">{viewMode === "model" ? "RA" : "Cámara"} no disponible aquí:</span>
          {insecureContext
            ? "esta página se cargó por HTTP en vez de HTTPS. Ábrela desde la URL publicada (https://…) para que la cámara y la RA funcionen."
            : "estás dentro del navegador de una app (Instagram/WhatsApp/TikTok). Toca el menú (⋯) y elige \"Abrir en el navegador\"."}
        </div>
      )}
      <div ref={containerRef} className={`relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-800 ${isFullscreen ? "h-screen w-screen rounded-none" : "rounded-xl aspect-video"}`}>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          className="absolute top-3 right-3 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 text-slate-200 backdrop-blur-sm transition-colors"
        >
          <Maximize className="h-4 w-4 text-blue-300" />
        </button>

        {viewMode === "mirror" ? (
          <FaceMirror active={viewMode === "mirror" && !insecureContext && !inAppBrowser} />
        ) : (
          <>
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
              ar-scale="fixed"
              environment-image="neutral"
              shadow-intensity="0.6"
              exposure="1.15"
              interaction-prompt="none"
              onClick={handleModelClick}
              style={{ position: "absolute", inset: 0, cursor: calibrating ? "crosshair" : undefined }}
            >
              <AnatomyHotspots
                visibleGroup={anatomyGroup}
                activation={activation}
                onActivationChange={(id, value) => updateActivation({ [id]: value })}
              />
            </ModelViewer>
            {!modelReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/70 text-slate-200 text-xs pointer-events-none">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando modelo 3D… {modelProgress}%
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-200 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
              <Rotate3d className="h-3.5 w-3.5 text-blue-300" />
              Modelo anatómico · WebAR
            </div>
            <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-300 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
              Arrastra para rotar
            </div>
            <button
              data-testid="screenshot-button"
              onClick={handleScreenshot}
              title="Guardar captura"
              className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-200 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-300" />
              Guardar foto
            </button>
            <div data-testid="device-badge" className={`absolute top-3 right-14 flex items-center gap-1.5 text-[11px] font-medium text-slate-200 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none transition-opacity ${isFullscreen ? "opacity-0" : "opacity-100"}`}>
              <Smartphone className="h-3.5 w-3.5 text-blue-300" />
              {isMobile ? "Móvil · RA lista" : "Escritorio"}
            </div>
          </>
        )}
      </div>

      {viewMode === "model" && (
        <>
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

          <button
            data-testid="simulate-button"
            onClick={simulating ? stopSimulation : runSimulation}
            disabled={!activeExerciseId}
            className={`mt-3 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-2.5 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${simulating ? "bg-rose-600 text-white border-rose-600 hover:bg-rose-700" : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"}`}
          >
            {simulating ? <Square className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
            {simulating ? "Detener simulación" : `Simular "${exerciseTitle ?? "movimiento"}"`}
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-1.5">
            Anima la contracción del músculo mapeado y acerca la cámara. También puedes{" "}
            <strong className="text-slate-500">arrastrar cualquier punto verde</strong> hacia arriba para activarlo manualmente.
          </p>

          <button data-testid="ar-button" onClick={handleAR} className="mt-4 w-full inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 pulse-ring">
            <Camera className="h-5 w-5 text-blue-400" />
            {isMobile ? "Ver en tu espacio en RA" : "Ver en RA (escanear con móvil)"}
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            {isMobile
              ? "Se abrirá la cámara de tu dispositivo para proyectar el modelo 3D. Las capas de músculos/nervio también se ven dentro de la sesión de RA."
              : "La Realidad Aumentada requiere un móvil o tablet. Escanea el código QR para abrirlo allí."}
          </p>
        </>
      )}

      {viewMode === "mirror" && (
        <p className="text-[11px] text-slate-400 text-center mt-4">
          Comparación en vivo de ceja / ojo / comisura de cada lado del rostro. Apoyo visual para la
          práctica frente al espejo — no sustituye la Escala de Sunnybrook del panel clínico.
        </p>
      )}

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
