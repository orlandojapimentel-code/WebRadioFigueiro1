
import React from 'react';

interface HeroProps {
  onOpenAgenda: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAgenda }) => {
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

        {/* BOTÕES DE AÇÃO REDESENHADOS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-4">
          <button 
            onClick={onOpenAgenda}
            className="group relative flex items-center space-x-4 px-10 py-5 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            {/* Efeito de Brilho ao passar o rato */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span>Agenda Cultural</span>
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-[8px] text-indigo-950 font-black rounded-bl-lg">NOVO</div>
          </button>
          
          <a 
            href="https://www.farmaciasdeservico.net/mapa/3719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center space-x-4 px-10 py-5 bg-white dark:bg-white/5 text-slate-700 dark:text-white border-2 border-slate-100 dark:border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm active:scale-95"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span>Farmácias</span>
          </a>
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
