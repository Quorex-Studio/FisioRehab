import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Float, ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
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
        gl={{ antialias: false, alpha: false }}
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

        {/* ScrollControls para sincronizar R3F con el scroll del usuario */}
        <ScrollControls pages={4} damping={0.1}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <AbstractModel />
          </Float>
        </ScrollControls>

        {/* Post-Procesamiento AAA */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
          <DepthOfField target={[0, 0, 0]} focalLength={0.02} bokehScale={2} height={480} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.002, 0.002] as any}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
