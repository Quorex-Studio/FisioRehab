import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScanFace } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { FacialNervesModel } from "../3d/FacialNervesModel";

export default function ArShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Contenido Narrativo */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4 shadow-sm">
              <ScanFace className="h-4 w-4 text-blue-600" />
              <span className="text-[11px] font-bold text-blue-700 tracking-wider uppercase">Tracking 478-Puntos</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight leading-tight mb-4">
              Precisión milimétrica con <span className="font-medium text-blue-600">IA Avanzada</span>
            </h2>
            <p className="text-lg text-slate-500 font-light leading-relaxed mb-6">
              Nuestra arquitectura proyecta un gemelo digital anatómico en tiempo real. Utilizando la topología facial y renderizado físico avanzado, calculamos asimetrías para guiar tu rehabilitación de forma objetiva, sin fricciones ni aplicaciones externas.
            </p>
          </motion.div>

          <div>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              onClick={() => {
                console.log('Navigating to /diagnostico from ArShowcase');
                navigate('/diagnostico');
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2 decoration-blue-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm cursor-pointer"
            >
              Probar simulador inmersivo en vivo &rarr;
            </motion.button>
          </div>
        </div>

        {/* Bloque WebGL / MediaPipe (Reserva de espacio absoluta CLS: 0) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative aspect-square md:aspect-video lg:aspect-square w-full rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl shadow-blue-900/10 contain-strict"
          style={{ minHeight: "350px" }}
        >
          {/* Overlay UI (HUD WebGL) */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-medium text-blue-400 border border-blue-500/30 uppercase tracking-wider flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live Face Mesh
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-slate-700/50 uppercase tracking-wider w-max">
              WebGL Engine
            </div>
          </div>
          
          {/* Lienzo 3D Diferido - Solo se carga al entrar en viewport */}
          {isInView && (
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full bg-slate-900" dpr={[1, 2]}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <Environment preset="city" />
              <FacialNervesModel />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} />
            </Canvas>
          )}
        </motion.div>
      </div>
    </section>
  );
}
