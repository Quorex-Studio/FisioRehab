import React from 'react';
import '@google/model-viewer';
import { Camera } from 'lucide-react';

interface HotspotProps {
  name: string;
  position: string;
  normal: string;
  label: string;
}

const hotspots: HotspotProps[] = [
  { name: 'frontalis', position: '0 0.5 0.1', normal: '0 0 1', label: 'M. Frontal' },
  { name: 'zygomaticus', position: '0.1 0.2 0.2', normal: '0.5 0 0.5', label: 'M. Cigomático Mayor' },
  { name: 'orbicularis-oris', position: '0 -0.1 0.2', normal: '0 0 1', label: 'M. Orbicular de los labios' },
  { name: 'facial-nerve', position: '-0.2 0.1 0', normal: '-1 0 0', label: 'Nervio Facial (VII Par)' },
];

export const AdvancedARViewer: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] glass-panel overflow-hidden group">
      {/* 
        Nota: Se requiere ts-ignore o declaraciones extendidas para <model-viewer> en JSX. 
        Usamos any temporalmente para las props personalizadas.
      */}
      {/* @ts-ignore */}
      <model-viewer
        src="/assets/models/face_model.glb" /* Path placeholder para el modelo .glb */
        alt="Modelo Anatómico Facial"
        auto-rotate
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        {hotspots.map((hotspot, idx) => (
          <button
            key={idx}
            className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(5,150,105,0.8)] border-2 border-white cursor-pointer relative group/hotspot transition-transform hover:scale-125"
            slot={`hotspot-${hotspot.name}`}
            data-position={hotspot.position}
            data-normal={hotspot.normal}
          >
            {/* Tooltip estilizado */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover/hotspot:opacity-100 transition-opacity pointer-events-none z-10">
              {hotspot.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/90"></div>
            </div>
          </button>
        ))}
      {/* @ts-ignore */}
      </model-viewer>

      {/* Botón premium de Ver en RA */}
      <button 
        slot="ar-button" 
        className="absolute bottom-4 right-4 flex items-center gap-2 px-5 py-2.5 bg-primary/90 hover:bg-primary text-white font-medium rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-primary/30"
        id="ar-button"
      >
        <Camera className="w-5 h-5" />
        Ver en RA
      </button>
    </div>
  );
};
