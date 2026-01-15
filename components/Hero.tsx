
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gray-950 min-h-[450px] md:min-h-[500px] flex flex-col justify-center items-center text-center px-4 md:px-8 py-16 md:py-20 border border-white/5 shadow-2xl">
      {/* Background Dinâmico */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
      </div>

      <div className="relative z-10 space-y-6 md:space-y-8 max-w-4xl w-full">
        <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 animate-in fade-in slide-in-from-top-4 duration-1000 mx-auto">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-400">Emissão HD Permanente</span>
        </div>

        <div className="space-y-1 md:space-y-2">
          <h2 className="text-3xl md:text-5xl font-brand font-light text-white tracking-tight opacity-90">
            Web Rádio
          </h2>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-brand font-black tracking-tighter text-white leading-none">
            FIGUEIRÓ<span className="text-blue-600 animate-pulse">.</span>
          </h1>
        </div>

        <p className="text-base md:text-xl lg:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed px-2 md:px-0 [text-wrap:balance]">
          A Sua Melhor Companhia, elevando a voz de <span className="text-white font-bold">Amarante</span> para o mundo através de cada nota musical.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 md:pt-8 w-full max-w-3xl mx-auto">
          <div className="p-5 md:p-6 bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/5 text-left group hover:bg-white/10 transition-all">
            <p className="text-blue-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">A Nossa Missão</p>
            <p className="text-xs md:text-sm text-slate-400 italic">"Levar alegria e boa música a todos os lares, criando uma comunidade unida."</p>
          </div>
          <div className="p-5 md:p-6 bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/5 text-left group hover:bg-white/10 transition-all">
            <p className="text-blue-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">Informação Útil</p>
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-slate-400">Localização</span>
              <span className="text-white font-bold">Figueiró, Amarante</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm mt-1">
              <span className="text-slate-400">Emissão</span>
              <span className="text-white font-bold">24h Non-Stop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
