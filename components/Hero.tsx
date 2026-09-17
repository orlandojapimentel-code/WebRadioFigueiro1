
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RADIO_LOGO } from '../src/constants';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleRadioState = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.isPlaying === 'boolean') {
        setIsPlaying(e.detail.isPlaying);
      }
    };
    window.addEventListener('wrf-radio-state' as any, handleRadioState);
    return () => {
      window.removeEventListener('wrf-radio-state' as any, handleRadioState);
    };
  }, []);

  const handlePlayClick = () => {
    window.dispatchEvent(new CustomEvent('wrf-toggle-play'));
  };

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-[#07090e] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] min-h-[560px] md:min-h-[640px] justify-center transition-all duration-500">
      
      {/* Studio Background Image with Smooth Depth of Field */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop" 
          alt="Studio Broadcast" 
          className="w-full h-full object-cover opacity-25 scale-105 filter saturate-150 animate-pulse-soft"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/90 via-[#07090e]/75 to-[#07090e]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e]"></div>
      </div>

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-20 w-full flex flex-col items-center text-center px-6 py-12 md:py-16">
        
        {/* Live Badge */}
        <div className="inline-flex items-center space-x-3 px-5 py-2 bg-white/[0.04] backdrop-blur-xl rounded-full border border-white/10 mb-8 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-200">
            {isPlaying ? 'Emissão no Ar • 320 kbps HD' : 'Emissão Digital HD • Direto de Figueiró'}
          </span>
        </div>

        <div className="max-w-4xl flex flex-col items-center">
          
          {/* Radio Station Emblem with Radiant Sound Ring */}
          <div className="relative w-32 h-32 md:w-44 md:h-44 mb-8 group cursor-pointer" onClick={handlePlayClick}>
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${isPlaying ? 'bg-red-600/40 scale-125 animate-pulse' : 'bg-red-600/20 group-hover:bg-red-600/35'}`}></div>
            <div className="relative w-full h-full p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/15 shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img 
                src={RADIO_LOGO} 
                alt="Web Rádio Figueiró" 
                className="w-full h-full object-contain rounded-full drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
              />
              {/* Play overlay on hover if not playing */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  {isPlaying ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-brand font-black tracking-tighter leading-[0.95] text-white mb-6">
            WEB RÁDIO<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-rose-400">
              FIGUEIRÓ
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed mb-10">
            {t.hero.description} <span className="text-white font-semibold">desde 2022</span>. Música, informação local de Amarante e proximidade com as nossas gentes.
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center">
            
            <button 
              onClick={handlePlayClick}
              className={`w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? 'bg-white text-slate-950 shadow-white/20' 
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  <span>Pausar Transmissão</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>{t.hero.cta}</span>
                </>
              )}
            </button>

            {/* Listeners Badge */}
            <div className="flex items-center space-x-3 bg-white/[0.04] backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
              <div className="flex -space-x-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#07090e] bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Ouvinte" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-white block leading-tight">+12.000</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ouvintes Ativos</span>
              </div>
            </div>

          </div>

          {/* Key Station Metadata Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-12 w-full max-w-lg border-t border-white/10 pt-8">
            <div className="text-center">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-red-500 uppercase tracking-widest block mb-0.5">Qualidade</span>
              <span className="text-sm sm:text-base font-black text-white">320 kbps HD</span>
            </div>
            <div className="text-center border-x border-white/10 px-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Origem</span>
              <span className="text-sm sm:text-base font-black text-white truncate">Amarante, PT</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest block mb-0.5">Emissão</span>
              <span className="text-sm sm:text-base font-black text-white">24/7 Online</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;

