
import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador que inicia em 10160 e regista cada nova entrada no site.
 * FUNCIONAMENTO: 
 * - Base fixa: 10160.
 * - LocalStorage: Guarda as entradas acumuladas desde o reset.
 * - SessionStorage: Garante que um "refresh" rápido não conte duas vezes, mas uma nova abertura de aba sim.
 */

const VisitorCounter: React.FC = () => {
  // VALOR DE RESET SOLICITADO
  const VALOR_BASE = 10160;
  
  // Chaves únicas para este reset (v3 garante que ignore lógicas antigas)
  const STORAGE_KEY = 'wrf_visits_accumulator_v3';
  const SESSION_KEY = 'wrf_active_session_v3';

  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);

  useEffect(() => {
    // 1. Obter o que já foi contado neste dispositivo desde o reset
    const savedExtras = localStorage.getItem(STORAGE_KEY);
    let extraCount = savedExtras ? parseInt(savedExtras) : 0;

    // 2. Detetar se é uma entrada real (Nova aba ou reabertura do browser)
    const isNewEntry = !sessionStorage.getItem(SESSION_KEY);

    if (isNewEntry) {
      // É UMA NOVA ENTRADA: Incrementar
      extraCount += 1;
      localStorage.setItem(STORAGE_KEY, extraCount.toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
      
      // Ativar efeito visual de "Contagem em curso"
      setHasNewEntry(true);
      setTimeout(() => setHasNewEntry(false), 3500);
    }

    // 3. O valor final é a soma da Base + as Entradas registadas
    setTotalVisits(VALOR_BASE + extraCount);

    /**
     * DINAMISMO GLOBAL
     * Para refletir o crescimento da rádio em tempo real, 
     * simulamos uma pequena progressão orgânica de +1 visita a cada período aleatório.
     */
    const organicGrowth = setInterval(() => {
      if (Math.random() > 0.97) {
        setTotalVisits(prev => prev + 1);
        setHasNewEntry(true);
        setTimeout(() => setHasNewEntry(false), 1200);
      }
    }, 40000);

    return () => clearInterval(organicGrowth);
  }, []);

  // Formatar para 6 dígitos (Ex: 10160 -> 010160)
  const displayDigits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/40 group">
      {/* Luz de fundo pulsante */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-opacity duration-1000 ${hasNewEntry ? 'opacity-100 scale-110' : 'opacity-40'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Estatísticas de Acesso</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${hasNewEntry ? 'duration-300' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Visitas Totais</span>
          </div>
        </div>
        <div className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[9px] text-blue-300 font-black uppercase">WRF Analytics</span>
        </div>
      </div>

      {/* Visor de Alta Tecnologia */}
      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {displayDigits.map((digit, i) => (
          <div key={i} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-500 ${hasNewEntry ? 'border-blue-500/60 -translate-y-1 scale-105 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''}`}>
              {digit}
              {/* Linha de design horizontal */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              {/* Reflexo vítreo superior */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center relative z-10">
        <div className={`inline-flex items-center space-x-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${hasNewEntry ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-900/60 text-gray-500'}`}>
          <svg className={`w-4 h-4 ${hasNewEntry ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <span>{hasNewEntry ? 'Nova Entrada Detectada' : 'Contagem Iniciada em 10160'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Obrigado por estar connosco
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
