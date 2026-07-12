import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useClinicalStore } from '../../store/useClinicalStore';

export const AbstractModel: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Consumimos el estado reactivo desde Zustand pero sin causar re-renders innecesarios.
  // En este caso, ya que queremos que cambie la animación, lo extraemos aquí.
  const activeExercise = useClinicalStore((state) => state.activeExercise);
  
  // Custom uniforms for a shader or we can use Drei's MeshDistortMaterial for an elite liquid glass look
  useFrame((state) => {
    if (meshRef.current) {
      // Base speeds
      let speedX = 0.2;
      let speedY = 0.3;
      let floatAmp = 0.2;
      
      // Dynamic adjustments based on exercise
      if (activeExercise === 'Smile') {
        speedX = 0.5;
        floatAmp = 0.5;
      } else if (activeExercise === 'Close_Eyes') {
        speedX = 0.05;
        speedY = 0.05;
        floatAmp = 0.05; // Calm, subtle
      } else if (activeExercise === 'Raise_Eyebrows') {
        speedY = 1.0;
        floatAmp = 0.8; // High energy
      }

      meshRef.current.rotation.x += speedX * 0.02; // Increment over time to avoid snap
      meshRef.current.rotation.y += speedY * 0.02;
      
      // Floating effect
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * floatAmp;
    }
  });

  return (
    <group>
      {/* Núcleo interno */}
      <Icosahedron ref={meshRef} args={[1.5, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#059669"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.8}
        />
      </Icosahedron>
      
      {/* Halo externo tipo wireframe tech */}
      <Icosahedron args={[2.2, 4]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#1d4ed8" wireframe transparent opacity={0.1} />
      </Icosahedron>

      {/* Partículas flotantes */}
      <Particles count={200} />
    </group>
  );
};

const Particles = ({ count }: { count: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -5 + Math.random() * 10;
      const yFactor = -5 + Math.random() * 10;
      const zFactor = -5 + Math.random() * 10;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </instancedMesh>
  );
};
