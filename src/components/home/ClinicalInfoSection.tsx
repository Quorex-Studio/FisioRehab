import { motion } from 'framer-motion';

const infoCards = [
  {
    title: "Análisis Topográfico",
    description: "Evaluación cuantitativa de la simetría facial mediante mapeo de 468 puntos nodales en tiempo real. La herramienta captura microexpresiones imperceptibles al ojo clínico estándar.",
    delay: 0.1
  },
  {
    title: "Métricas de Recuperación",
    description: "El sistema genera una escala de evaluación basada en la respuesta motora, comparando el lado afectado con el lado sano a través de un algoritmo de correlación espacial.",
    delay: 0.2
  },
  {
    title: "Biorretroalimentación",
    description: "El paciente visualiza sus vectores de movimiento al instante. Esta corrección visual activa áreas neuromotoras, acelerando la plasticidad cerebral y la recuperación muscular.",
    delay: 0.3
  }
];

export default function ClinicalInfoSection() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-20 md:w-2/3">
        <h2 className="text-3xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
          La ciencia detrás de la <span className="font-medium text-blue-600">evaluación dinámica.</span>
        </h2>
        <p className="text-xl text-slate-500 font-light leading-relaxed">
          Comprender la materia es el primer paso. Reemplazamos la estimación visual subjetiva por recolección de datos biométricos exactos para guiar cada fase de la rehabilitación motora.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {infoCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: card.delay, ease: "easeOut" }}
            className="p-10 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 mb-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              0{index + 1}
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-4">
              {card.title}
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
