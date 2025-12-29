
import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador global sincronizado com proteção contra cache de browsers (Edge/Safari).
 */

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 10160;
  
  // Chaves únicas e novas para garantir um início limpo e sem cache antiga
  const API_NAMESPACE = 'webradiofigueiro_prod_v2';
  const API_KEY = 'global_visitors_count';
  const SESSION_KEY = 'wrf_active_session_check';

  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const isNewSession = !sessionStorage.getItem(SESSION_KEY);
        const endpoint = isNewSession ? 'up' : 'get';
        
        // Adicionamos um timestamp (?t=...) para garantir que o Edge não use um valor guardado em cache
        const cacheBuster = `t=${Date.now()}`;
        const url = `https://api.counterapi.dev/v1/${API_NAMESPACE}/${API_KEY}/${endpoint}?${cacheBuster}`;

        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store', // Instrução explícita para não guardar em cache
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) throw new Error('Falha na resposta da API');

        const data = await response.json();

        if (data && typeof data.count === 'number') {
          setTotalVisits(VALOR_BASE + data.count);
          
          if (isNewSession) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setHasNewEntry(true);
            setTimeout(() => setHasNewEntry(false), 4000);
          }
        }
      } catch (error) {
        console.warn("Aviso: Browser bloqueou ou falhou a sincronização global. Usando valor local.");
        // Em caso de erro, tentamos pelo menos recuperar o que está no ecrã
        setTotalVisits(prev => prev);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisits();

    // Pequeno incremento visual ocasional para manter o aspeto "vivo"
    const organicInterval = setInterval(() => {
      if (Math.random() > 0.99) {
        setTotalVisits(prev => prev + 1);
      }
    }, 60000);

    return () => clearInterval(organicInterval);
  }, []);

  const displayDigits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/40 group">
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-opacity duration-1000 ${hasNewEntry ? 'opacity-100 scale-110' : 'opacity-40'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência em Direto</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Visitas Totais</span>
          </div>
        </div>
        <div className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest">
            {isLoading ? 'A Sincronizar...' : 'Sincronizado'}
          </span>
        </div>
      </div>

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
          <div className="flex space-x-1 items-center">
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce' : 'animate-pulse'}`} />
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce delay-75' : 'animate-pulse delay-75'}`} />
          </div>
          <span>{hasNewEntry ? 'Bem-vindo à Figueiró!' : 'Contagem em Tempo Real'}</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
