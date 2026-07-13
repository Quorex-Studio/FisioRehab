
import HeroSection from '../components/home/HeroSection';
import ClinicalInfoSection from '../components/home/ClinicalInfoSection';
import ArShowcase from '../components/home/ArShowcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* 
        El background incluye un gradiente radial extremadamente sutil 
        para romper el blanco plano sin perder la estética clínica.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50" />
      
      <div className="relative z-10">
        <HeroSection />
        <ClinicalInfoSection />
        <ArShowcase />
      </div>
    </main>
  );
}
