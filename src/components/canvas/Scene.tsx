import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { AbstractModel } from './Model';
import { BlendFunction } from 'postprocessing';
import { useClinicalStore } from '../../store/useClinicalStore';
import gsap from 'gsap';

const CameraController = () => {
  const { camera } = useThree();
  const activeExercise = useClinicalStore((state) => state.activeExercise);

  useEffect(() => {
    // Definimos las posiciones objetivo según el ejercicio clínico
    let targetPos = { x: 0, y: 0, z: 8 }; // Rest position
    
    switch (activeExercise) {
      case 'Smile':
        targetPos = { x: 0, y: -1, z: 6 }; // Acercamiento a zona inferior
        break;
      case 'Close_Eyes':
        targetPos = { x: 0, y: 1.5, z: 5 }; // Paneo/Zoom orbital cinemático
        break;
      case 'Raise_Eyebrows':
        targetPos = { x: 0, y: 2.5, z: 5.5 }; // Acercamiento a zona frontal
        break;
      default:
        targetPos = { x: 0, y: 0, z: 8 };
        break;
    }

    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
      }
    });

  }, [activeExercise, camera]);

  return null;
};

export const Scene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-background">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <CameraController />
        <color attach="background" args={['#09090b']} />
        
        {/* Iluminación Cinematográfica */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#059669" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#1d4ed8" />
        
        {/* Entorno HDRI para reflejos */}
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <AbstractModel />
        </Float>

        {/* Post-Procesamiento AAA - Optimizado para nitidez (4K/HD) y rendimiento */}
        <EffectComposer multisampling={4}>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0015, 0.0015] as any}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
