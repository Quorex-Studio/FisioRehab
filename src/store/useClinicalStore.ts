import { create } from 'zustand';

export type ClinicalExercise = 'Rest' | 'Smile' | 'Close_Eyes' | 'Raise_Eyebrows' | null;

export interface EvaluationRecord {
  id: string;
  timestamp: string;
  exercise: ClinicalExercise;
  grade: number;
  timeElapsed: number;
}

interface ClinicalState {
  activeExercise: ClinicalExercise;
  stopwatchTime: number;
  sunnybrookGrade: number;
  evaluationLogs: EvaluationRecord[];
  
  setActiveExercise: (exercise: ClinicalExercise) => void;
  setStopwatchTime: (time: number) => void;
  setSunnybrookGrade: (grade: number) => void;
  recordEvaluation: () => void;
  resetTelemetry: () => void;
}

export const useClinicalStore = create<ClinicalState>((set) => ({
  activeExercise: 'Rest',
  stopwatchTime: 0,
  sunnybrookGrade: 1,
  evaluationLogs: [],

  setActiveExercise: (exercise) => set({ activeExercise: exercise }),
  
  setStopwatchTime: (time) => set({ stopwatchTime: time }),
  
  setSunnybrookGrade: (grade) => set({ sunnybrookGrade: grade }),
  
  recordEvaluation: () => set((state) => {
    if (state.activeExercise === 'Rest' || state.activeExercise === null) return state;
    
    const newRecord: EvaluationRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      exercise: state.activeExercise,
      grade: state.sunnybrookGrade,
      timeElapsed: state.stopwatchTime,
    };
    
    return {
      evaluationLogs: [...state.evaluationLogs, newRecord],
      // Reset after recording
      activeExercise: 'Rest',
      stopwatchTime: 0,
      sunnybrookGrade: 1,
    };
  }),
  
  resetTelemetry: () => set({
    activeExercise: 'Rest',
    stopwatchTime: 0,
    sunnybrookGrade: 1,
  }),
}));
