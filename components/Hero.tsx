
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[500px] md:min-h-[700px] w-full flex items-center justify-center overflow-hidden rounded-[3.5rem] md:rounded-[6rem] bg-[#02020a] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
      
      {/* BACKGROUND DECORATIVO - SEM A LINHA VERTICAL */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05]" 
             style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '50px 50px' }}></div>
        
        {/* Orbs de luz dinâmicos para profundidade */}
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
        <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        
        {/* BADGE PREMIUM */}
        <div className="inline-flex items-center space-x-3 px-7 py-3.5 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/10 mb-14 group hover:border-blue-500/40 transition-all duration-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-100 group-hover:text-blue-400 transition-colors">Digital High Fidelity Stream</span>
        </div>

        {/* TÍTULO PRINCIPAL - FIGUEIRÓ */}
        <div className="max-w-7xl space-y-4">
          <h2 className="text-2xl md:text-4xl font-brand font-medium text-slate-500 tracking-[0.7em] uppercase">
            Web Rádio
          </h2>
          <h1 className="text-7xl sm:text-[10rem] md:text-[15rem] font-brand font-[1000] tracking-tighter text-shimmer leading-[0.8] py-8 filter drop-shadow-[0_25px_50px_rgba(59,130,246,0.25)]">
            FIGUEIRÓ<span className="text-blue-600">.</span>
          </h1>
        </div>

        <p className="mt-14 text-xl md:text-3xl text-slate-300 font-medium max-w-3xl leading-relaxed">
          Sintonize a voz de Amarante. Paixão musical e tecnologia digital <span className="text-white font-bold border-b-4 border-blue-600">desde 2022</span>.
        </p>

        {/* INFO CARDS - ESTILO STUDIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24 w-full max-w-5xl">
          <div className="glass-card p-14 rounded-[3.5rem] text-left relative overflow-hidden group border-white/5">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-80"></div>
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 text-white shadow-2xl shadow-blue-600/30">
               <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
            </div>
            <h4 className="text-white font-black text-3xl mb-4 tracking-tighter">Missão Local</h4>
            <p className="text-slate-300 text-lg leading-relaxed opacity-80">Conectando Figueiró ao mundo através de cada nota musical com o orgulho da nossa terra.</p>
          </div>

          <div className="glass-card p-14 rounded-[3.5rem] text-left relative overflow-hidden group border-white/5">
             <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-80"></div>
             <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8 text-white shadow-2xl shadow-indigo-600/30">
               <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            </div>
            <h4 className="text-white font-black text-3xl mb-4 tracking-tighter">Qualidade HD</h4>
            <p className="text-slate-300 text-lg leading-relaxed opacity-80">Emissão cristalina em 320kbps com processamento de áudio profissional de última geração.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
