export type ExerciseId =
  | "sonrisa"
  | "ojos"
  | "cejas"
  | "ceno"
  | "mejillas"
  | "labios";

export interface FacialExercise {
  id: ExerciseId;
  title: string;
  instruction: string;
  muscle: string;
  nerveBranch: string;
  icon: string; // lucide icon name, resolved in component
}

export const EXERCISES: FacialExercise[] = [
  {
    id: "sonrisa",
    title: "Simula una sonrisa",
    instruction: "Eleva de forma simétrica ambas comisuras de los labios y mantén la posición 5 segundos.",
    muscle: "Cigomático mayor",
    nerveBranch: "Rama cigomática / bucal",
    icon: "Smile",
  },
  {
    id: "ojos",
    title: "Cierra ambos ojos",
    instruction: "Cierra los párpados con firmeza, sin forzar, y compara la simetría de ambos lados.",
    muscle: "Orbicular de los párpados",
    nerveBranch: "Rama temporal / cigomática",
    icon: "Eye",
  },
  {
    id: "cejas",
    title: "Eleva las cejas",
    instruction: "Levanta ambas cejas lo más alto posible, arrugando la frente de forma pareja.",
    muscle: "Frontal (occipitofrontal)",
    nerveBranch: "Rama temporal",
    icon: "ChevronsUp",
  },
  {
    id: "ceno",
    title: "Frunce el ceño",
    instruction: "Junta las cejas hacia el centro como si estuvieras concentrado o molesto.",
    muscle: "Corrugador superciliar",
    nerveBranch: "Rama temporal",
    icon: "Frown",
  },
  {
    id: "mejillas",
    title: "Infla las mejillas",
    instruction: "Llena de aire ambas mejillas y sostén sin dejar escapar el aire por las comisuras.",
    muscle: "Buccinador",
    nerveBranch: "Rama bucal",
    icon: "Wind",
  },
  {
    id: "labios",
    title: "Frunce los labios",
    instruction: "Junta y proyecta los labios hacia adelante, como para silbar o dar un beso.",
    muscle: "Orbicular de los labios",
    nerveBranch: "Rama bucal / mandibular",
    icon: "CircleDot",
  },
];

export interface ScaleGrade {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
  example: string;
}

export const SCALE_GRADES: ScaleGrade[] = [
  {
    value: 1,
    label: "Sin movimiento",
    description: "No hay contracción muscular visible. El lado afectado permanece inmóvil frente al estímulo.",
    example: "Al pedir sonrisa, solo se mueve el lado sano; el afectado no responde.",
  },
  {
    value: 2,
    label: "Leve",
    description: "Movimiento apenas perceptible, muy por debajo del lado sano y con esfuerzo evidente.",
    example: "Se insinúa un levantamiento mínimo de la comisura, casi imperceptible.",
  },
  {
    value: 3,
    label: "Moderado",
    description: "Movimiento claro pero incompleto o asimétrico respecto al lado sano.",
    example: "La comisura se eleva, pero menos y más lento que el lado sano.",
  },
  {
    value: 4,
    label: "Bueno",
    description: "Movimiento casi completo, con ligera asimetría solo detectable en comparación directa.",
    example: "Ambos lados se mueven de forma similar, con una diferencia mínima de amplitud.",
  },
  {
    value: 5,
    label: "Completo",
    description: "Movimiento simétrico y completo, equivalente al lado sano.",
    example: "Ambas comisuras se elevan igual, sin diferencia visible entre lados.",
  },
];
