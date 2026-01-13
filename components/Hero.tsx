
import React from 'react';

interface HeroProps {
  onOpenAgenda: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAgenda }) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-blue-900 dark:via-indigo-950 dark:to-gray-900 p-8 md:p-16 text-center shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/5 transition-all duration-500">
      {/* Efeitos de luz de fundo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black border border-blue-500/20 uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Emissão Permanente</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
          Web Rádio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Figueiró</span>
        </h2>
        
        <div className="space-y-6">
          <p className="text-lg md:text-2xl text-slate-600 dark:text-blue-100/90 font-medium tracking-wide">
            A Sua Melhor Companhia, em qualquer parte do mundo.
          </p>

          {/* BOTÕES DE AÇÃO RÁPIDA */}
          <div className="flex flex-wrap justify-center gap-4 py-4">
            <button 
              onClick={onOpenAgenda}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-500/20 transform transition-all hover:-translate-y-1 active:scale-95 flex items-center space-x-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Agenda Cultural</span>
            </button>
            
            <a 
              href="https://www.farmaciasdeservico.net/mapa/3719" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm dark:backdrop-blur-md transform transition-all hover:-translate-y-1 active:scale-95 flex items-center space-x-3"
            >
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a10.003 10.003 0 01-4.415-4.415l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022L7.887 3.688a2 2 0 00-2.828 0L3.688 5.059a2 2 0 000 2.828l1.371 1.371a2 2 0 001.022.547l2.387.477a2 2 0 001.96 1.414l.722-2.166a10.003 10.003 0 014.415 4.415l-2.166.722a2 2 0 00-1.414 1.96l.477 2.387a2 2 0 00.547 1.022l1.371 1.371a2 2 0 002.828 0l1.371-1.371a2 2 0 000-2.828l-1.371-1.371z"/></svg>
              <span>Farmácias de Serviço</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/40 dark:bg-black/30 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 text-left transition-colors">
              <h3 className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3">A Nossa Missão</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed italic">
                "Levar alegria e boa música a todos os lares. Somos mais que uma rádio, somos uma comunidade unida pela paixão de comunicar e entreter."
              </p>
            </div>
            <div className="bg-white/40 dark:bg-black/30 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 text-left transition-colors">
              <h3 className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3">Informação Útil</h3>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-gray-300">
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
      </div>
    </div>
  );
};

export default Hero;
