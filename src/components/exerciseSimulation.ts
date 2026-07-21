import type { ExerciseId } from "./exercises";

/**
 * Qué hotspots (ver AnatomyHotspots.tsx) se activan visualmente cuando el
 * usuario elige cada ejercicio y pulsa "Simular movimiento", o cuando toca
 * ese hotspot manualmente en el visor 3D.
 */
export const EXERCISE_HOTSPOT_MAP: Record<ExerciseId, string[]> = {
  sonrisa: ["zygomaticus-r", "zygomaticus-l"],
  ojos: ["orbicularis-oculi-r", "orbicularis-oculi-l"],
  cejas: ["frontalis-r", "frontalis-l"],
  // Aún no hay un hotspot dedicado al corrugador superciliar; el frontal
  // es la mejor aproximación disponible hasta calibrar uno específico.
  ceno: ["frontalis-r", "frontalis-l"],
  mejillas: ["buccinator-r", "buccinator-l"],
  labios: ["orbicularis-oris"],
};
