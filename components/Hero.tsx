
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[550px] md:min-h-[650px] w-full flex items-center justify-center overflow-hidden rounded-[3rem] md:rounded-[4rem] bg-[#020617] border border-white/5 shadow-2xl">
      
      {/* BACKGROUND TÉCNICO E ARTÍSTICO */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Camada 1: Mesh Gradient Animado */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        
        {/* Camada 2: Grelha Técnica de Estúdio */}
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07]" 
             style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
        
        {/* Camada 3: Textura de Ruído Analógico */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        
        {/* Camada 4: Linha de varrimento (VFX) */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[2px] animate-scan z-10"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        
        {/* BADGE DE STATUS OLED STYLE */}
        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 mb-10 transform hover:scale-105 transition-transform duration-500 shadow-xl">
          <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Emissão Digital HD</span>
          <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Amarante</span>
        </div>

        {/* TIPOGRAFIA BRANDING PRINCIPAL */}
        <div className="max-w-5xl space-y-4">
          <h2 className="text-3xl md:text-5xl font-brand font-extralight text-white/70 tracking-tight">
            Web Rádio
          </h2>
          <div className="relative inline-block">
             <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-brand font-[900] tracking-tighter text-white leading-[0.85] filter drop-shadow-2xl">
              FIGUEIRÓ<span className="text-blue-600 inline-block animate-pulse">.</span>
            </h1>
            {/* Reflexo Elegante */}
            <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-transparent to-white/5 blur-xl -z-10 opacity-50"></div>
          </div>
        </div>

        <p className="mt-12 text-lg md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed [text-wrap:balance]">
          Sintonize a <span className="text-white border-b-2 border-blue-600/50">excelência sonora</span>. Elevando a voz de Amarante para o mundo com tecnologia de ponta e paixão musical.
        </p>

        {/* INFO CARDS - GLASSMORPHISM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-w-4xl">
          <div className="group relative p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 text-left transition-all hover:bg-white/10 hover:-translate-y-1">
            <div className="absolute top-6 right-8 text-blue-600/30 group-hover:text-blue-600/60 transition-colors">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Conceito</p>
            <h4 className="text-white font-bold text-xl mb-2">A Nossa Missão</h4>
            <p className="text-slate-400 text-sm leading-relaxed italic">"Criar ligações através da música, levando Amarante a todos os corações."</p>
          </div>

          <div className="group relative p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 text-left transition-all hover:bg-white/10 hover:-translate-y-1">
             <div className="absolute top-6 right-8 text-indigo-600/30 group-hover:text-indigo-600/60 transition-colors">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Broadcasting</p>
            <h4 className="text-white font-bold text-xl mb-4">Emissão Global</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-tighter">Estúdio Principal</span>
                <span className="text-white font-black">Figueiró</span>
              </div>
              <div className="w-full h-[1px] bg-white/5"></div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-tighter">Bitrate HD</span>
                <span className="text-blue-400 font-black">320kbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
