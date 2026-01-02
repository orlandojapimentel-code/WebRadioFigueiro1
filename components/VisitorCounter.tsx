
import React, { useState, useEffect, useRef } from 'react';

/**
 * COMPONENTE: VisitorCounter (Versão v32 - ULTRA RESILIENTE)
 */

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 10170; 
  const SITE_ID = 'wrf_official_production_v32';
  
  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const [status, setStatus] = useState<'sync' | 'online' | 'offline'>('sync');
  
  const hasHit = useRef(false);

  const performSync = async (isFirstLoad: boolean) => {
    const action = isFirstLoad ? 'up' : 'get';
    const url = `https://api.counterapi.dev/v1/${SITE_ID}/counter/${action}?t=${Date.now()}`;

    try {
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const novoTotal = VALOR_BASE + data.count;
        if (novoTotal > totalVisits && status === 'online') {
          setHasNewEntry(true);
          setTimeout(() => setHasNewEntry(false), 3000);
        }
        setTotalVisits(novoTotal);
        setStatus('online');
      }
    } catch (err) {
      // Falha silenciosa: mantém o número mas sinaliza modo standby
      setStatus('offline');
    }
  };

  useEffect(() => {
    if (!hasHit.current) {
      performSync(true);
      hasHit.current = true;
    }
    const interval = setInterval(() => performSync(false), 20000);
    return () => clearInterval(interval);
  }, [totalVisits]);

  const digits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-all duration-1000 ${hasNewEntry ? 'opacity-100 scale-150 bg-blue-500/30' : 'opacity-20'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência Global</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'online' ? 'bg-green-400' : 'bg-orange-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'online' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
              {status === 'online' ? 'Em Direto' : 'Modo Standby'}
            </span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${status === 'online' ? 'bg-blue-600/10 border-blue-500/20 text-blue-300' : 'bg-orange-950/40 border-orange-500/20 text-orange-400'}`}>
          {status === 'sync' ? 'A LIGAR' : status === 'online' ? 'ONLINE' : 'STANDBY'}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {digits.map((digit, i) => (
          <div key={`${i}-${digit}-${totalVisits}`} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-500 ${hasNewEntry ? 'border-blue-400/50 -translate-y-1 scale-105 text-white' : ''}`}>
              {digit}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center relative z-10">
        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Web Rádio Figueiró • 24H Online
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
