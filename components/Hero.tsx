
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[3rem] bg-white dark:bg-gray-950 p-8 md:p-20 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-white/5 transition-all duration-700">
      {/* Efeitos de Iluminação de Fundo */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
        {/* Badge de Status */}
        <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-[0.25em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>Emissão HD Permanente</span>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
            Web Rádio <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-400 bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]">Figueiró</span>
          </h2>
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium tracking-tight max-w-2xl mx-auto">
            A Sua Melhor Companhia, elevando a voz de Amarante para o mundo.
          </p>
        </div>
        
        {/* Grid de Missão/Info com design mais limpo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="group p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-transparent hover:border-indigo-500/10 transition-all text-left">
            <h3 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.25em] text-[10px] mb-4">A Nossa Missão</h3>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              "Levar alegria e boa música a todos os lares, criando uma comunidade unida pela paixão de comunicar e entreter."
            </p>
          </div>
          <div className="group p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-transparent hover:border-indigo-500/10 transition-all text-left">
            <h3 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.25em] text-[10px] mb-4">Informação Útil</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Localização</p>
                <p className="text-sm font-bold text-slate-700 dark:text-white">Figueiró, Amarante</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Emissão</p>
                <p className="text-sm font-bold text-slate-700 dark:text-white">24h Non-Stop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
