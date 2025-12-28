
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-900 p-8 md:p-16 text-center shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold border border-blue-500/30">
          A OUVIR EM DIRETO 24/7
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
          Web Rádio <span className="text-blue-400">Figueiró</span>
        </h2>
        <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed font-light">
          Levamos até si a melhor música e a companhia de que precisa, onde quer que esteja. Somos a voz da comunidade e a trilha sonora dos seus melhores momentos.
        </p>
      </div>
    </div>
  );
};

export default Hero;
