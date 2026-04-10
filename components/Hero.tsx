
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RADIO_LOGO } from '../src/constants';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-black border border-white/10 shadow-2xl">
      
      {/* Imagem de Fundo Desfocada (Estilo Mega Web Radio) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2000&auto=format&fit=crop" 
          alt="Radio Studio Background" 
          className="w-full h-full object-cover opacity-60 blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black"></div>
      </div>

      {/* Aurora Background Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '50px 50px' }}></div>
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-20 w-full pt-16 md:pt-32 pb-0 flex flex-col items-center text-center px-6">
        {/* Badge Animada */}
        <div className="inline-flex items-center space-x-3 px-7 py-3.5 bg-red-600/10 backdrop-blur-3xl rounded-2xl border border-red-500/20 mb-10 group hover:border-red-500/40 transition-all duration-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-red-100 group-hover:text-red-400">Emissão 24H Ultra HD</span>
        </div>

        <div className="max-w-7xl space-y-4 mb-14 bg-black/60 backdrop-blur-md p-10 rounded-3xl border border-white/10 flex flex-col items-center">
          <div className="w-32 h-32 md:w-48 md:h-48 mb-8 relative">
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl animate-pulse"></div>
            <img src={RADIO_LOGO} alt="Web Rádio Figueiró" className="w-full h-full object-contain relative z-10" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand font-black tracking-tighter leading-tight py-6 text-white">
            FIGUEIRÓ<span className="text-red-600">.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-4xl leading-relaxed">
            {t.hero.description} <span className="text-white font-black border-b-4 border-red-600 pb-1">desde 2022</span>.
          </p>
        </div>

        {/* Banner de Estatísticas Atualizado conforme solicitado: 12M e 5+ */}
        <div className="w-full bg-red-600 py-12 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          <div className="flex flex-col items-center border-r-0 md:border-r border-white/20">
            <span className="text-5xl md:text-8xl font-brand font-black text-white tracking-tighter mb-2">12 M</span>
            <span className="text-[10px] md:text-[14px] font-black uppercase tracking-[0.4em] text-red-100 opacity-90">{t.hero.stats.listeners}</span>
          </div>
          <div className="flex flex-col items-center border-r-0 md:border-r border-white/20">
            <span className="text-5xl md:text-8xl font-brand font-black text-white tracking-tighter mb-2">5 +</span>
            <span className="text-[10px] md:text-[14px] font-black uppercase tracking-[0.4em] text-red-100 opacity-90">{t.hero.stats.programs}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-8xl font-brand font-black text-white tracking-tighter mb-2">83 K</span>
            <span className="text-[10px] md:text-[14px] font-black uppercase tracking-[0.4em] text-red-100 opacity-90">{t.hero.stats.reach}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
