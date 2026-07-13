import { Video, FileText, ArrowUpRight } from "lucide-react";

const RESOURCES = [
  { id: "res-1", type: "Video", icon: Video, title: "Ejercicios de mímica facial guiados", meta: "Fisioterapia · 8 min", image: "https://images.unsplash.com/photo-1645005513751-e22717a66ae6?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: "res-2", type: "Artículo", icon: FileText, title: "Neuroplasticidad en la parálisis de Bell", meta: "Artículo médico · 6 min", image: "https://images.unsplash.com/photo-1709880754472-be89c13abc52?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: "res-3", type: "Video", icon: Video, title: "Rutina de estimulación en casa", meta: "Fisioterapia · 12 min", image: "https://images.unsplash.com/photo-1645005512942-a17817fb7c11?crop=entropy&cs=srgb&fm=jpg&q=85" },
];

export const ResourcesGrid = () => {
  return (
    <section data-testid="resources-grid" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-bold text-slate-900">Recursos recomendados</h3>
        <span className="text-xs font-medium text-slate-400">Videos y artículos clínicos</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RESOURCES.map((res) => {
          const Icon = res.icon;
          return (
            <a key={res.id} data-testid={`resource-${res.id}`} href="#" onClick={(e) => e.preventDefault()} className="group bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-200/70 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-36 overflow-hidden">
                <img src={res.image} alt={res.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Icon className="h-3.5 w-3.5 text-blue-600" />
                  {res.type}
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">{res.title}</h4>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{res.meta}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Ver recurso
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
