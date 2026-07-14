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
 */

export type HotspotCategory = "muscle" | "nerve";

export interface AnatomyHotspot {
  id: string;
  label: string;
  detail: string;
  category: HotspotCategory;
  position: string; // "x y z" en espacio del modelo
  normal: string; // "x y z"
}

export const ANATOMY_HOTSPOTS: AnatomyHotspot[] = [
  // --- Músculos faciales ---
  { id: "frontalis-r", label: "Frontal (D)", detail: "Eleva la ceja y arruga la frente", category: "muscle", position: "1.3 2.6 1.8", normal: "0 0 1" },
  { id: "frontalis-l", label: "Frontal (I)", detail: "Eleva la ceja y arruga la frente", category: "muscle", position: "-1.3 2.6 1.8", normal: "0 0 1" },
  { id: "orbicularis-oculi-r", label: "Orbicular de párpados (D)", detail: "Cierra el ojo", category: "muscle", position: "1.6 1.2 2.0", normal: "0 0 1" },
  { id: "orbicularis-oculi-l", label: "Orbicular de párpados (I)", detail: "Cierra el ojo", category: "muscle", position: "-1.6 1.2 2.0", normal: "0 0 1" },
  { id: "zygomaticus-r", label: "Cigomático mayor (D)", detail: "Eleva la comisura al sonreír", category: "muscle", position: "1.8 -0.3 2.1", normal: "0 0 1" },
  { id: "zygomaticus-l", label: "Cigomático mayor (I)", detail: "Eleva la comisura al sonreír", category: "muscle", position: "-1.8 -0.3 2.1", normal: "0 0 1" },
  { id: "orbicularis-oris", label: "Orbicular de los labios", detail: "Cierra y proyecta los labios", category: "muscle", position: "0 -1.3 2.3", normal: "0 0 1" },
  { id: "buccinator-r", label: "Buccinador (D)", detail: "Comprime la mejilla contra los dientes", category: "muscle", position: "2.0 -0.7 1.6", normal: "0 0 1" },
  { id: "buccinator-l", label: "Buccinador (I)", detail: "Comprime la mejilla contra los dientes", category: "muscle", position: "-2.0 -0.7 1.6", normal: "0 0 1" },

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

/**
 * Renderiza los <button slot="hotspot-*"> que <model-viewer> necesita como hijos
 * directos. Solo se incluyen los hotspots del grupo activo (o ninguno).
 * Estos hotspots también se ven dentro de una sesión de RA real en el móvil.
 */
export const AnatomyHotspots = ({ visibleGroup }: { visibleGroup: HotspotCategory | "none" }) => {
  if (visibleGroup === "none") return null;
  const items = ANATOMY_HOTSPOTS.filter((h) => h.category === visibleGroup);

  return (
    <>
      {items.map((h) => (
        <button
          key={h.id}
          slot={`hotspot-${h.id}`}
          data-position={h.position}
          data-normal={h.normal}
          data-testid={`hotspot-${h.id}`}
          className={`relative flex items-center justify-center h-3 w-3 rounded-full border-2 shadow ${dotClass[h.category]} animate-pulse`}
          title={`${h.label} — ${h.detail}`}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold text-white bg-slate-900/85 rounded-md px-1.5 py-0.5 pointer-events-none">
            {h.label}
          </span>
        </button>
      ))}
    </>
  );
};
