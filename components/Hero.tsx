
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden rounded-[3.5rem] md:rounded-[6rem] bg-[#02020a] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.95)]">
      
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.07]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '50px 50px' }}></div>
        <div className="absolute -top-60 -left-60 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
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

        <div className="max-w-7xl space-y-4 mb-14">
          <h2 className="text-xl md:text-3xl font-brand font-medium text-slate-400 tracking-[0.7em] uppercase">{t.hero.subtitle}</h2>
          <h1 className="text-7xl sm:text-[10rem] md:text-[13rem] lg:text-[16rem] font-brand font-[1000] tracking-tighter leading-[0.8] py-6 filter drop-shadow-[0_25px_50px_rgba(239,68,68,0.3)]">
            <span className="text-white">FIGUEIRÓ</span><span className="text-red-600">.</span>
          </h1>
        </div>

        <p className="text-xl md:text-3xl text-slate-300 font-medium max-w-4xl leading-relaxed mb-20 px-4">
          {t.hero.description} <span className="text-white font-black border-b-4 border-red-600 pb-1">desde 2022</span>.
        </p>

        {/* Banner de Estatísticas */}
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
