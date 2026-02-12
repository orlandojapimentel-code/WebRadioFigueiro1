
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[500px] md:min-h-[650px] w-full flex items-center justify-center overflow-hidden rounded-[3rem] md:rounded-[5rem] bg-[#050510] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
      
      {/* BACKGROUND DECORATIVO */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.08]" 
             style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-blue-500/40 via-blue-500/10 to-transparent"></div>
        {/* Orbs de luz extras para o Hero */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        
        {/* BADGE PREMIUM */}
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 mb-12 group hover:border-blue-500/50 transition-all">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white group-hover:text-blue-400 transition-colors">Digital High Fidelity Stream</span>
        </div>

        {/* TÍTULO PRINCIPAL */}
        <div className="max-w-6xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-brand font-medium text-slate-400 tracking-[0.6em] uppercase">
            Web Rádio
          </h2>
          <h1 className="text-7xl sm:text-9xl md:text-[13rem] font-brand font-[950] tracking-tighter text-shimmer leading-[0.85] py-6 filter drop-shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
            FIGUEIRÓ<span className="text-blue-600">.</span>
          </h1>
        </div>

        <p className="mt-12 text-xl md:text-3xl text-slate-300 font-medium max-w-3xl leading-relaxed">
          Sintonize a voz de Amarante. Paixão musical e tecnologia digital <span className="text-white font-bold border-b-2 border-blue-600">desde 2022</span>.
        </p>

        {/* INFO CARDS SUPER-CONTRASTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 w-full max-w-5xl">
          <div className="glass-card p-12 rounded-[3rem] text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 text-white shadow-xl shadow-blue-600/20">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
            </div>
            <h4 className="text-white font-black text-2xl mb-3 tracking-tighter">Missão Local</h4>
            <p className="text-slate-300 text-base leading-relaxed opacity-90">Conectando Figueiró ao mundo através de cada nota musical com orgulho em Amarante.</p>
          </div>

          <div className="glass-card p-12 rounded-[3rem] text-left relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
             <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 text-white shadow-xl shadow-indigo-600/20">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            </div>
            <h4 className="text-white font-black text-2xl mb-3 tracking-tighter">Qualidade HD</h4>
            <p className="text-slate-300 text-base leading-relaxed opacity-90">Emissão cristalina em 320kbps com processamento de áudio profissional de estúdio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
