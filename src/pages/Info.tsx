import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { AlertTriangle, ArrowRight, Lightbulb, PlayCircle } from "lucide-react";
import { EXERCISES } from "@/data/exercises";

const TIPS = [
  {
    title: "Practica frente a un espejo",
    body: "La retroalimentación visual ayuda al cerebro a corregir la asimetría en tiempo real. Realiza cada ejercicio despacio, observando ambos lados del rostro.",
  },
  {
    title: "Sesiones cortas y frecuentes",
    body: "Es preferible hacer 3–4 sesiones breves al día (5–10 minutos) que una sola sesión larga. La constancia favorece la neuroplasticidad.",
  },
  {
    title: "No fuerces el movimiento",
    body: "Si aparece dolor, espasmo o fatiga muscular, detente y descansa. El objetivo es el control simétrico, no la máxima intensidad.",
  },
  {
    title: "Compara siempre ambos lados",
    body: "Registra el grado de la escala (1–5) para cada ejercicio y compáralo entre sesiones; esa tendencia es más útil que un valor aislado.",
  },
  {
    title: "Protege el ojo si no cierra bien",
    body: "Si no logras el cierre palpebral completo, consulta con oftalmología: la protección corneal es prioritaria mientras se recupera la función motora.",
  },
  {
    title: "Acompañamiento profesional",
    body: "Este simulador apoya el seguimiento del progreso, pero no sustituye la evaluación de un fisioterapeuta o médico especialista.",
  },
];

const VIDEOS = [
  {
    id: "8PcHtClQWyI",
    title: "Ejercicios para parálisis facial — Ask Doctor Jo",
    meta: "Fisioterapia guiada · Canal especializado",
  },
  {
    id: "hNg_uJ62X8M",
    title: "Cómo reactivar los músculos faciales tras una parálisis",
    meta: "Fisioterapia guiada",
  },
  {
    id: "GfPq2oDHcjk",
    title: "10 ejercicios simples de apoyo a la recuperación",
    meta: "Rutina corta · Frente al espejo",
  },
];

export default function Info() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-14">
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Información y consejos para la rehabilitación facial
          </h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Guía de apoyo para pacientes con parálisis o paresia facial: consejos prácticos, videos de
            fisioterapia y acceso directo al simulador con escala de evaluación y visor en Realidad Aumentada.
          </p>
          <Link
            to="/diagnostico"
            data-testid="cta-simulator"
            className="mt-2 inline-flex w-fit items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 text-sm font-semibold shadow-sm shadow-blue-600/30 transition-all hover:-translate-y-0.5"
          >
            Ir al simulador clínico
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Consejos para la práctica diaria</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{tip.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Videos de ejercicios guiados</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIDEOS.map((v) => (
              <div key={v.id} data-testid={`video-${v.id}`} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">{v.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{v.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-slate-900">Ejercicios evaluados en el simulador</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXERCISES.map((ex) => (
              <div key={ex.id} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-900">{ex.title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{ex.instruction}</p>
                <p className="text-[11px] text-blue-600 font-medium mt-2">{ex.muscle} · {ex.nerveBranch}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="medical-disclaimer" className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            Este contenido es educativo y de apoyo al seguimiento clínico. No reemplaza el diagnóstico ni el
            plan de tratamiento de un profesional de la salud. Ante síntomas nuevos o de aparición súbita,
            busca atención médica de inmediato.
          </p>
        </section>
      </main>
    </div>
  );
}
