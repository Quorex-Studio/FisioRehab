import { Link } from "react-router-dom";
import { Activity, ShieldCheck } from "lucide-react";

export const Header = () => {
  return (
    <header data-testid="app-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/30">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
              Facio<span className="text-blue-600">Rehab</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">Rehabilitación de parálisis facial</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-500">
          <Link to="/informacion" data-testid="nav-informacion" className="hover:text-blue-600 transition-colors">Información y consejos</Link>
          <Link to="/diagnostico" data-testid="nav-simulador" className="hover:text-blue-600 transition-colors">Simulador</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Sesión clínica activa
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-slate-800">Dra. L. Ferreira</p>
              <p className="text-[11px] text-slate-500">Fisioterapia neurológica</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold">LF</div>
          </div>
        </div>
      </div>
    </header>
  );
};
