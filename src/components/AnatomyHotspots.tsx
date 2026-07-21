import { useRef } from "react";
import { ArrowUp, ArrowLeftRight, Minimize2 } from "lucide-react";

/**
 * Hotspots anatómicos para el visor de RA (model-viewer).
 *
 * IMPORTANTE — calibración pendiente:
 * Las coordenadas de "position" son estimaciones dentro de la caja delimitadora
 * del modelo (LeePerrySmith head, aprox. X:[-4.3,4.3] Y:[-4,4] Z:[-2.6,2.6]).
 * No corresponden todavía a puntos anatómicos exactos verificados sobre TU malla.
 *
 * Para calibrar con precisión:
 * 1. Activa el "Modo calibración" (botón en ArViewer, solo visible en dev).
 * 2. Haz clic sobre el punto exacto del músculo/nervio en el modelo 3D.
 * 3. Se copiará al portapapeles y aparecerá en consola la posición y normal exactas
 *    (usa el método nativo `positionAndNormalFromPoint` de <model-viewer>).
 * 4. Reemplaza el valor de "position"/"normal" correspondiente aquí abajo.
 *
 * IMPORTANTE — sobre la "activación" (arrastre / simulación):
 * El modelo (face.glb) es una malla ESTÁTICA sin morph targets ni huesos, así
 * que no se puede deformar geometría real (el músculo no "abulta" en 3D).
 * Lo que ves aquí es una capa de retroalimentación visual (anillo + flecha +
 * porcentaje) superpuesta sobre el punto anatómico real, controlada por
 * arrastre o por la simulación automática. Es una guía de dirección/esfuerzo,
 * no una deformación anatómica — para eso se necesitaría reemplazar el
 * modelo por uno con blendshapes (p.ej. topología ARKit de 52 formas).
 */

export type HotspotCategory = "muscle" | "nerve";
export type ActivationDirection = "up" | "in" | "out";

export interface AnatomyHotspot {
  id: string;
  label: string;
  detail: string;
  category: HotspotCategory;
  position: string; // "x y z" en espacio del modelo
  normal: string; // "x y z"
  direction?: ActivationDirection; // solo músculos: hacia dónde "tira" al contraerse
}

export const ANATOMY_HOTSPOTS: AnatomyHotspot[] = [
  // --- Músculos faciales ---
  { id: "frontalis-r", label: "Frontal (D)", detail: "Eleva la ceja y arruga la frente", category: "muscle", position: "1.3 2.6 1.8", normal: "0 0 1", direction: "up" },
  { id: "frontalis-l", label: "Frontal (I)", detail: "Eleva la ceja y arruga la frente", category: "muscle", position: "-1.3 2.6 1.8", normal: "0 0 1", direction: "up" },
  { id: "orbicularis-oculi-r", label: "Orbicular de párpados (D)", detail: "Cierra el ojo", category: "muscle", position: "1.6 1.2 2.0", normal: "0 0 1", direction: "in" },
  { id: "orbicularis-oculi-l", label: "Orbicular de párpados (I)", detail: "Cierra el ojo", category: "muscle", position: "-1.6 1.2 2.0", normal: "0 0 1", direction: "in" },
  { id: "zygomaticus-r", label: "Cigomático mayor (D)", detail: "Eleva la comisura al sonreír", category: "muscle", position: "1.8 -0.3 2.1", normal: "0 0 1", direction: "up" },
  { id: "zygomaticus-l", label: "Cigomático mayor (I)", detail: "Eleva la comisura al sonreír", category: "muscle", position: "-1.8 -0.3 2.1", normal: "0 0 1", direction: "up" },
  { id: "orbicularis-oris", label: "Orbicular de los labios", detail: "Cierra y proyecta los labios", category: "muscle", position: "0 -1.3 2.3", normal: "0 0 1", direction: "in" },
  { id: "buccinator-r", label: "Buccinador (D)", detail: "Comprime la mejilla contra los dientes", category: "muscle", position: "2.0 -0.7 1.6", normal: "0 0 1", direction: "out" },
  { id: "buccinator-l", label: "Buccinador (I)", detail: "Comprime la mejilla contra los dientes", category: "muscle", position: "-2.0 -0.7 1.6", normal: "0 0 1", direction: "out" },

  // --- Ramas del nervio facial (VII par craneal) ---
  { id: "nerve-temporal-r", label: "Rama temporal (D)", detail: "Inerva frontal y corrugador", category: "nerve", position: "1.4 2.2 1.0", normal: "1 0 0" },
  { id: "nerve-temporal-l", label: "Rama temporal (I)", detail: "Inerva frontal y corrugador", category: "nerve", position: "-1.4 2.2 1.0", normal: "-1 0 0" },
  { id: "nerve-zygomatic-r", label: "Rama cigomática (D)", detail: "Inerva orbicular de párpados y cigomático", category: "nerve", position: "1.7 0.6 1.2", normal: "1 0 0" },
  { id: "nerve-zygomatic-l", label: "Rama cigomática (I)", detail: "Inerva orbicular de párpados y cigomático", category: "nerve", position: "-1.7 0.6 1.2", normal: "-1 0 0" },
  { id: "nerve-buccal-r", label: "Rama bucal (D)", detail: "Inerva buccinador y orbicular de labios", category: "nerve", position: "1.9 -0.2 1.3", normal: "1 0 0" },
  { id: "nerve-buccal-l", label: "Rama bucal (I)", detail: "Inerva buccinador y orbicular de labios", category: "nerve", position: "-1.9 -0.2 1.3", normal: "-1 0 0" },
  { id: "nerve-mandibular-r", label: "Rama mandibular (D)", detail: "Inerva músculos del labio inferior", category: "nerve", position: "1.6 -1.4 1.1", normal: "1 0 0" },
  { id: "nerve-mandibular-l", label: "Rama mandibular (I)", detail: "Inerva músculos del labio inferior", category: "nerve", position: "-1.6 -1.4 1.1", normal: "-1 0 0" },
  { id: "nerve-cervical-r", label: "Rama cervical (D)", detail: "Inerva el platisma del cuello", category: "nerve", position: "1.3 -2.6 0.4", normal: "1 0 0" },
  { id: "nerve-cervical-l", label: "Rama cervical (I)", detail: "Inerva el platisma del cuello", category: "nerve", position: "-1.3 -2.6 0.4", normal: "-1 0 0" },
];

const dotClass: Record<HotspotCategory, string> = {
  muscle: "bg-emerald-500 border-emerald-200",
  nerve: "bg-yellow-400 border-yellow-100",
};

const DirectionIcon = ({ direction }: { direction: ActivationDirection }) => {
  if (direction === "up") return <ArrowUp className="h-3 w-3" />;
  if (direction === "in") return <Minimize2 className="h-3 w-3" />;
  return <ArrowLeftRight className="h-3 w-3" />;
};

interface AnatomyHotspotsProps {
  visibleGroup: HotspotCategory | "none";
  /** id del hotspot -> activación 0-100, controlada por arrastre o simulación */
  activation?: Record<string, number>;
  onActivationChange?: (id: string, value: number) => void;
}

/**
 * Renderiza los <button slot="hotspot-*"> que <model-viewer> necesita como hijos
 * directos. Solo se incluyen los hotspots del grupo activo (o ninguno).
 * Estos hotspots también se ven dentro de una sesión de RA real en el móvil.
 *
 * Los hotspots de músculo son arrastrables verticalmente: press + drag hacia
 * arriba "activa" el músculo (0-100%), y al soltar vuelve a 0 con una
 * transición suave — simula "movilizar" el punto sin deformar la malla 3D.
 */
export const AnatomyHotspots = ({ visibleGroup, activation = {}, onActivationChange }: AnatomyHotspotsProps) => {
  const dragState = useRef<{ id: string; startY: number; startValue: number } | null>(null);

  if (visibleGroup === "none") return null;
  const items = ANATOMY_HOTSPOTS.filter((h) => h.category === visibleGroup);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, hotspot: AnatomyHotspot) => {
    if (hotspot.category !== "muscle" || !onActivationChange) return;
    e.stopPropagation();
    dragState.current = { id: hotspot.id, startY: e.clientY, startValue: activation[hotspot.id] ?? 0 };

    const onMove = (ev: PointerEvent) => {
      if (!dragState.current || dragState.current.id !== hotspot.id) return;
      const deltaY = dragState.current.startY - ev.clientY; // arrastrar hacia arriba = activar
      const value = Math.min(100, Math.max(0, dragState.current.startValue + (deltaY / 70) * 100));
      onActivationChange(hotspot.id, value);
    };
    const onUp = () => {
      dragState.current = null;
      onActivationChange(hotspot.id, 0); // relaja de vuelta (con transición CSS)
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      {items.map((h) => {
        const value = Math.round(activation[h.id] ?? 0);
        const active = value > 3;
        return (
          <button
            key={h.id}
            slot={`hotspot-${h.id}`}
            data-position={h.position}
            data-normal={h.normal}
            data-testid={`hotspot-${h.id}`}
            onPointerDown={(e) => handlePointerDown(e, h)}
            className={`relative flex items-center justify-center h-3 w-3 rounded-full border-2 shadow ${dotClass[h.category]} ${h.category === "muscle" ? "cursor-grab active:cursor-grabbing touch-none" : "animate-pulse"}`}
            title={h.category === "muscle" ? `${h.label} — arrastra hacia arriba para simular contracción` : `${h.label} — ${h.detail}`}
            style={{ transform: `scale(${1 + value / 140})`, transition: "transform 400ms ease-out" }}
          >
            {h.category === "muscle" && (
              <span
                className="absolute inset-0 rounded-full bg-emerald-400"
                style={{ opacity: value / 160, transform: `scale(${1.6 + value / 30})`, transition: "all 400ms ease-out" }}
              />
            )}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold text-white bg-slate-900/85 rounded-md px-1.5 py-0.5 pointer-events-none flex items-center gap-1">
              {h.direction && active && <DirectionIcon direction={h.direction} />}
              {h.label}
              {active && <span className="text-emerald-300">· {value}%</span>}
            </span>
          </button>
        );
      })}
    </>
  );
};
