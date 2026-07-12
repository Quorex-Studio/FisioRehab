import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { ShieldCheck, Zap, Stethoscope, ArrowUpCircle } from 'lucide-react';
import Lenis from 'lenis';
import { ClinicalEvaluation } from './ClinicalEvaluation';
import { ProgressTable } from './ProgressTable';
import { VRButton } from '@react-three/xr';
import { xrStore } from '../../store/xrStore';

declare global {
  interface Window {
    customLenis: Lenis;
  }
}

export const HUD: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth Scroll setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Make lenis globally available for buttons if needed, or just rely on native scroll
    window.customLenis = lenis;

    return () => {
      lenis.destroy();
      // @ts-ignore
      delete window.customLenis;
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const yHero = useTransform(scrollYProgress, [0, 0.2], ['0vh', '-100vh']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const yFeature1 = useTransform(scrollYProgress, [0.2, 0.4, 0.6], ['100vh', '0vh', '-100vh']);
  const opacityFeature1 = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0]);

  const yFeature2 = useTransform(scrollYProgress, [0.5, 0.7, 0.9], ['100vh', '0vh', '-100vh']);
  const opacityFeature2 = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [0, 1, 0]);

  const scrollToSection = (vhMultiplier: number) => {
    if (window.customLenis) {
      window.customLenis.scrollTo(window.innerHeight * vhMultiplier, { duration: 1.5 });
    } else {
      window.scrollTo({ top: window.innerHeight * vhMultiplier, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full" style={{ height: '400vh' }}>
      
      {/* SECTION 1: Hero */}
      <motion.div 
        style={{ y: yHero, opacity: opacityHero }}
        className="fixed top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="glass-panel p-6 md:p-12 text-center max-w-4xl mx-4 pointer-events-auto flex flex-col items-center gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl"
          >
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tighter">
            FacioRehab
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl font-light">
            Experiencia Clínica Volumétrica de Nueva Generación.
          </p>
          <div className="mt-4 md:mt-8">
            <MagneticButton onClick={() => scrollToSection(1.6)}>
              <Zap className="w-5 h-5" />
              INICIAR DIAGNÓSTICO
            </MagneticButton>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: Clinical Simulator (Replaces Feature 1) */}
      <motion.div 
        style={{ y: yFeature1, opacity: opacityFeature1 }}
        className="fixed top-0 left-0 w-full h-[100dvh] flex items-center justify-between pointer-events-none px-4 md:px-12 gap-8"
      >
        <div className="w-full flex justify-between items-start pt-10 md:pt-20">
          <ClinicalEvaluation />
          
          <div className="hidden lg:flex flex-col gap-6 w-full max-w-lg items-end">
            <div className="glass-panel p-6 pointer-events-auto w-full text-right flex flex-col gap-2 border-r-4 border-r-primary">
              <div className="flex items-center justify-end gap-3 text-primary mb-2">
                <Stethoscope className="w-6 h-6" />
                <h2 className="text-2xl font-bold text-white">Análisis Biomecánico</h2>
              </div>
              <p className="text-slate-300 text-sm">
                Motor WebGL evaluando función del nervio facial en tiempo real. 
                Selecciona un protocolo para aislar las fibras musculares.
              </p>
            </div>
            
            <ProgressTable />
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: Feature 2 (WebXR Portal) */}
      <motion.div 
        style={{ y: yFeature2, opacity: opacityFeature2 }}
        className="fixed top-0 left-0 w-full h-[100dvh] flex items-center justify-end pointer-events-none px-4 md:px-24"
      >
        <div className="glass-panel p-6 md:p-10 max-w-lg pointer-events-auto text-right flex flex-col items-end gap-6 border-r-4 border-r-secondary mx-4 md:mx-0">
          <h2 className="text-3xl md:text-5xl font-black text-white">Portal de Realidad Virtual</h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Ingresa a la clínica virtual y manipula los tejidos anatómicos directamente con tus manos gracias al seguimiento óptico (Hand-Tracking) de WebXR.
          </p>
          
          <div className="flex flex-col gap-4 mt-4 w-full items-end">
            {/* El botón de VR nativo de R3F se insertará aquí */}
            <div className="vr-button-container relative z-50">
              <VRButton store={xrStore} />
            </div>

            <MagneticButton onClick={() => scrollToSection(0)} className="bg-white/10 hover:bg-white/20">
              <ArrowUpCircle className="w-5 h-5" />
              VOLVER AL INICIO
            </MagneticButton>
          </div>
        </div>
      </motion.div>

      {/* Footer Indicador */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest uppercase flex flex-col items-center gap-2 pointer-events-none">
        Scroll para explorar
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>

    </div>
  );
};
