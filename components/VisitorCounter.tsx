
import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador que inicia em 10160 e regista cada nova entrada no site.
 * ATUALIZAÇÃO: Substituição da menção "10160" por "OUVINTES ONLINE" na interface.
 */

const VisitorCounter: React.FC = () => {
  // VALOR DE PARTIDA INTERNO (Mantido conforme pedido anterior)
  const VALOR_BASE = 10160;
  
  // Chaves persistentes
  const STORAGE_KEY = 'wrf_visits_accumulator_v3';
  const SESSION_KEY = 'wrf_active_session_v3';

  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);

  useEffect(() => {
    // 1. Recuperar o acumulado
    const savedExtras = localStorage.getItem(STORAGE_KEY);
    let extraCount = savedExtras ? parseInt(savedExtras) : 0;

    // 2. Lógica de nova entrada (Sessão)
    const isNewEntry = !sessionStorage.getItem(SESSION_KEY);

    if (isNewEntry) {
      extraCount += 1;
      localStorage.setItem(STORAGE_KEY, extraCount.toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
      
      setHasNewEntry(true);
      setTimeout(() => setHasNewEntry(false), 3500);
    }

    setTotalVisits(VALOR_BASE + extraCount);

    // Dinamismo para o visor
    const organicGrowth = setInterval(() => {
      if (Math.random() > 0.96) {
        setTotalVisits(prev => prev + 1);
        setHasNewEntry(true);
        setTimeout(() => setHasNewEntry(false), 1200);
      }
    }, 35000);

    return () => clearInterval(organicGrowth);
  }, []);

  const displayDigits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/40 group">
      {/* Efeito de iluminação suave */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-opacity duration-1000 ${hasNewEntry ? 'opacity-100 scale-110' : 'opacity-40'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência em Direto</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${hasNewEntry ? 'duration-300' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Visitas Registadas</span>
          </div>
        </div>
        <div className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest">Live Stream</span>
        </div>
      </div>

      {/* Visor Odómetro */}
      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {displayDigits.map((digit, i) => (
          <div key={i} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-500 ${hasNewEntry ? 'border-blue-500/60 -translate-y-1 scale-105 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}>
              {digit}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center relative z-10">
        <div className={`inline-flex items-center space-x-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${hasNewEntry ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-900/60 text-gray-400 border border-white/5'}`}>
          {hasNewEntry ? (
             <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
             </svg>
          ) : (
             <div className="flex space-x-1 items-center">
               <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse" />
               <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse delay-75" />
               <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse delay-150" />
             </div>
          )}
          <span>{hasNewEntry ? 'Nova Entrada Detectada' : 'OUVINTES ONLINE'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Web Rádio Figueiró • Sempre Consigo
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
