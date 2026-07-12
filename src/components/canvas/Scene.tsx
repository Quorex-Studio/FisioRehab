import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import { AbstractModel } from './Model';
import { BlendFunction } from 'postprocessing';

export const Scene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-background">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 2]}
      >
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
