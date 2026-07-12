import React, { useReducer, useMemo } from 'react';
import { Activity, Smile, AlertCircle } from 'lucide-react';

interface SunnybrookState {
  resting: {
    eye: number;
    cheek: number;
    mouth: number;
  };
  voluntary: {
    forehead: number;
    eyeClosure: number;
    smile: number;
    snarl: number;
    pucker: number;
  };
  synkinesis: {
    forehead: number;
    eyeClosure: number;
    smile: number;
    snarl: number;
    pucker: number;
  };
}

type Action = 
  | { type: 'SET_RESTING'; field: keyof SunnybrookState['resting']; value: number }
  | { type: 'SET_VOLUNTARY'; field: keyof SunnybrookState['voluntary']; value: number }
  | { type: 'SET_SYNKINESIS'; field: keyof SunnybrookState['synkinesis']; value: number };

const initialState: SunnybrookState = {
  resting: { eye: 0, cheek: 0, mouth: 0 },
  voluntary: { forehead: 1, eyeClosure: 1, smile: 1, snarl: 1, pucker: 1 },
  synkinesis: { forehead: 0, eyeClosure: 0, smile: 0, snarl: 0, pucker: 0 },
};

function reducer(state: SunnybrookState, action: Action): SunnybrookState {
  switch (action.type) {
    case 'SET_RESTING':
      return { ...state, resting: { ...state.resting, [action.field]: action.value } };
    case 'SET_VOLUNTARY':
      return { ...state, voluntary: { ...state.voluntary, [action.field]: action.value } };
    case 'SET_SYNKINESIS':
      return { ...state, synkinesis: { ...state.synkinesis, [action.field]: action.value } };
    default:
      return state;
  }
}

export const SunnybrookCalculator: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { compositeScore } = useMemo(() => {
    const restSum = Object.values(state.resting).reduce((a, b) => a + b, 0);
    const volSum = Object.values(state.voluntary).reduce((a, b) => a + b, 0);
    const synSum = Object.values(state.synkinesis).reduce((a, b) => a + b, 0);

    const restingScore = restSum * 5;
    const voluntaryScore = volSum * 4;
    const synkinesisScore = synSum;
    const compositeScore = voluntaryScore - restingScore - synkinesisScore;

    return { restingScore, voluntaryScore, synkinesisScore, compositeScore };
  }, [state]);

  const scale1to5 = [
    { value: 1, label: '1 - Sin movimiento' },
    { value: 2, label: '2 - Leve' },
    { value: 3, label: '3 - Excursión leve' },
    { value: 4, label: '4 - Casi completo' },
    { value: 5, label: '5 - Completo' },
  ];

  return (
    <div className="w-full glass-panel p-6 flex flex-col gap-8">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Sunnybrook Facial Grading</h2>
          <p className="text-slate-500 text-sm">Calculadora de estado clínico en tiempo real</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-sm text-slate-500 font-medium">Puntuación Compuesta</span>
          <div className={`text-4xl font-bold ${compositeScore < 50 ? 'text-destructive' : 'text-primary'}`}>
            {compositeScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sección A: Reposo */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-secondary font-medium">
            <Activity className="w-5 h-5" />
            <h3>A. Reposo (Simetría)</h3>
          </div>
          <div className="glass-card p-4 flex flex-col gap-3">
            {(['eye', 'cheek', 'mouth'] as const).map((field) => (
              <div key={field} className="flex justify-between items-center">
                <span className="capitalize text-slate-700">{field}</span>
                <select 
                  className="glass-input px-3 py-1.5 outline-none"
                  value={state.resting[field]}
                  onChange={(e) => dispatch({ type: 'SET_RESTING', field, value: Number(e.target.value) })}
                >
                  <option value={0}>Normal (0)</option>
                  <option value={1}>Leve (1)</option>
                  <option value={2}>Severo (2)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Sección B: Movimiento Voluntario */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Smile className="w-5 h-5" />
            <h3>B. Movimiento Voluntario</h3>
          </div>
          <div className="glass-card p-4 flex flex-col gap-3">
            {(['forehead', 'eyeClosure', 'smile', 'snarl', 'pucker'] as const).map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <span className="capitalize text-slate-700 text-sm font-medium">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                  {scale1to5.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => dispatch({ type: 'SET_VOLUNTARY', field, value: opt.value })}
                      className={`min-w-[40px] h-[36px] px-2 rounded-md border text-sm font-medium transition-all ${
                        state.voluntary[field] === opt.value
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={opt.label}
                    >
                      {opt.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección C: Sincinesia */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-destructive font-medium">
            <AlertCircle className="w-5 h-5" />
            <h3>C. Sincinesia (Penalización)</h3>
          </div>
          <div className="glass-card p-4 flex flex-col gap-3">
            {(['forehead', 'eyeClosure', 'smile', 'snarl', 'pucker'] as const).map((field) => (
              <div key={field} className="flex justify-between items-center">
                <span className="capitalize text-slate-700 text-sm">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                <select 
                  className="glass-input px-2 py-1 outline-none text-sm"
                  value={state.synkinesis[field]}
                  onChange={(e) => dispatch({ type: 'SET_SYNKINESIS', field, value: Number(e.target.value) })}
                >
                  <option value={0}>Ninguna (0)</option>
                  <option value={1}>Leve (1)</option>
                  <option value={2}>Moderada (2)</option>
                  <option value={3}>Severa (3)</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
