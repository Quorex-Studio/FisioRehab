import { useGLTF, CatmullRomLine, Float } from "@react-three/drei";

export function FacialNervesModel() {
  const { nodes } = useGLTF("/models/face.glb") as any;
  
  // Color médico para los nervios (amarillo eléctrico)
  const nerveColor = "#eab308"; 
  
  // Coordenadas anatómicas aproximadas para la red del Nervio Facial (VII Par Craneal)
  // Lado Derecho
  const originR = [1.2, 0.2, 0.3]; // Glándula parótida (origen aparente)
  const temporalR = [originR, [1.1, 0.8, 0.8], [0.8, 1.3, 1.2], [0.4, 1.6, 1.5]];
  const zygomaticR = [originR, [1.0, 0.5, 1.0], [0.7, 0.6, 1.5], [0.4, 0.5, 1.8]];
  const buccalR = [originR, [0.9, 0.1, 1.1], [0.6, 0.0, 1.7], [0.2, 0.0, 1.9]];
  const mandibularR = [originR, [0.8, -0.3, 1.0], [0.5, -0.5, 1.6], [0.2, -0.6, 1.8]];
  const cervicalR = [originR, [0.8, -0.6, 0.5], [0.5, -1.0, 0.6]];

  // Lado Izquierdo (X invertido)
  const originL = [-1.2, 0.2, 0.3];
  const temporalL = [originL, [-1.1, 0.8, 0.8], [-0.8, 1.3, 1.2], [-0.4, 1.6, 1.5]];
  const zygomaticL = [originL, [-1.0, 0.5, 1.0], [-0.7, 0.6, 1.5], [-0.4, 0.5, 1.8]];
  const buccalL = [originL, [-0.9, 0.1, 1.1], [-0.6, 0.0, 1.7], [-0.2, 0.0, 1.9]];
  const mandibularL = [originL, [-0.8, -0.3, 1.0], [-0.5, -0.5, 1.6], [-0.2, -0.6, 1.8]];
  const cervicalL = [originL, [-0.8, -0.6, 0.5], [-0.5, -1.0, 0.6]];

  const branches = [
    temporalR, zygomaticR, buccalR, mandibularR, cervicalR,
    temporalL, zygomaticL, buccalL, mandibularL, cervicalL
  ];

  return (
    <group scale={2.5} position={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Cabeza Anatómica (Material Glassmorfismo) */}
        {nodes && Object.values(nodes).map((node: any, idx: number) => {
          if (node.isMesh) {
            return (
              <mesh key={idx} geometry={node.geometry}>
                <meshPhysicalMaterial 
                  color="#1e293b" 
                  transmission={0.8} 
                  opacity={0.7} 
                  transparent 
                  roughness={0.2} 
                  thickness={3}
                  envMapIntensity={2}
                  wireframe={false}
                />
              </mesh>
            );
          }
          return null;
        })}
        
        {/* Sistema Nervioso Procedural */}
        {branches.map((points: any, idx) => (
          <CatmullRomLine
            key={idx}
            points={points}
            closed={false}
            curveType="chordal"
            tension={0.5}
            color={nerveColor}
            lineWidth={3}
          />
        ))}
        
        {/* Nodos Sinápticos (Puntos de conexión/Landmarks) */}
        {branches.map((points: any, i) => (
          <group key={`nodes-${i}`}>
            {points.map((pt: any, j: number) => (
              <mesh position={pt} key={j}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            ))}
          </group>
        ))}
      </Float>
    </group>
  );
}

useGLTF.preload("/models/face.glb");
