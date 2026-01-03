
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-900 p-8 md:p-16 text-center shadow-2xl border border-white/5">
      {/* Efeitos de luz de fundo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black border border-blue-500/20 uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Emissão Permanente</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
          Web Rádio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Figueiró</span>
        </h2>
        
        <div className="space-y-6">
          <p className="text-lg md:text-2xl text-blue-100/90 font-medium tracking-wide">
            A Sua Melhor Companhia, em qualquer parte do mundo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 text-left">
              <h3 className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3">A Nossa Missão</h3>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "Levar alegria e boa música a todos os lares. Somos mais que uma rádio, somos uma comunidade unida pela paixão de comunicar e entreter."
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 text-left">
              <h3 className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3">Informação Útil</h3>
              <ul className="text-xs space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  <span><strong>Localização:</strong> Figueiró, Amarante, Portugal</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  <span><strong>Programação:</strong> 24 Horas Online</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  <span><strong>Estilo:</strong> Hits, Clássicos e muita música Portuguesa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            <span className="text-xs font-bold text-gray-300 uppercase">Som HD Digital</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="text-xs font-bold text-gray-300 uppercase">Figueiró no Coração</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
