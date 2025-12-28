
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-900 p-8 md:p-16 text-center shadow-2xl border border-white/5">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black border border-blue-500/20 uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Emissão Online 24 Horas</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
          Web Rádio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Figueiró</span>
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg md:text-2xl text-blue-100/90 leading-relaxed font-medium">
            A Sua Melhor Companhia, em qualquer parte do mundo.
          </p>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed italic">
            "Somos a voz da nossa gente e a melodia que une corações. Na Web Rádio Figueiró, priorizamos a proximidade com os ouvintes, oferecendo uma programação diversificada que vai dos clássicos aos hits do momento, sempre com a dedicação que nos caracteriza."
          </p>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            <span className="text-xs font-bold text-gray-300 uppercase">Qualidade HD</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="text-xs font-bold text-gray-300 uppercase">Feito com Amor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
