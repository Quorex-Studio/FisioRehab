import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <span className="inline-block px-4 py-1.5 text-sm font-medium tracking-wider text-blue-700 uppercase bg-blue-100/50 border border-blue-200 rounded-full backdrop-blur-sm">
          Simulador de Grado Médico en AR
        </span>
        
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-slate-900">
          Rehabilitación facial <br/>
          <span className="font-semibold text-blue-600">precisión milimétrica.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-slate-500 font-light leading-relaxed">
          Nuestra tecnología analiza la musculatura facial en tiempo real mediante puntos clave, ofreciendo una evaluación objetiva y ejercicios guiados desde cualquier navegador.
        </p>

        <div className="pt-8">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Navigating to /diagnostico');
              navigate('/diagnostico');
            }}
            className="inline-block relative px-8 py-4 text-lg font-medium text-white transition-all duration-300 bg-blue-600 rounded-2xl shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-700 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer"
          >
            Iniciar Diagnóstico
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
