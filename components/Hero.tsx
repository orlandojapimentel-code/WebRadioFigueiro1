
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RADIO_LOGO } from '../src/constants';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-[#02020a] border border-white/5 shadow-2xl min-h-[600px] justify-center">
      
      {/* Imagem de Fundo Dinâmica */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop" 
          alt="Studio" 
          className="w-full h-full object-cover opacity-40 scale-110 animate-pulse-soft"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02020a]/80 via-transparent to-[#02020a]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#02020a] via-transparent to-[#02020a]"></div>
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 z-10 mesh-gradient opacity-60"></div>

      <div className="relative z-20 w-full flex flex-col items-center text-center px-6 py-20">
        {/* Live Badge Premium */}
        <div className="inline-flex items-center space-x-4 px-6 py-2.5 bg-white/[0.03] backdrop-blur-2xl rounded-full border border-white/10 mb-12 animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Emissão Digital HD</span>
        </div>

        <div className="max-w-5xl flex flex-col items-center">
          <div className="w-40 h-40 md:w-56 md:h-56 mb-12 relative group">
            <div className="absolute inset-0 bg-red-600/30 rounded-full blur-3xl group-hover:bg-red-600/50 transition-all duration-700 animate-pulse"></div>
            <img src={RADIO_LOGO} alt="WRF" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
          </div>
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-brand font-black tracking-tighter leading-[0.9] text-white mb-8">
            WEB RÁDIO<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-white bg-300% animate-shimmer">FIGUEIRÓ</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
            {t.hero.description} <span className="text-white font-black">desde 2022</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="px-12 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-95">
              {t.hero.cta}
            </button>
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#02020a] bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
              <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold flex items-center">
                +12K Ouvintes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
