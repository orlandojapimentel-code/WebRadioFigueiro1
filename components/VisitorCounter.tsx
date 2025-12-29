
import React, { useState, useEffect, useRef } from 'react';

/**
 * COMPONENTE: VisitorCounter (Versão v30 - ULTRA SYNC)
 * FOCO: Garantir que cada refresh/entrada soma +1 e sincroniza entre browsers.
 */

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 10160;
  
  // Usando um ID totalmente novo e único para esta rádio
  const SITE_ID = 'wrf_portugal_live_final_v30';
  
  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const [status, setStatus] = useState<'sync' | 'online' | 'offline'>('sync');
  
  const hasHit = useRef(false);

  const performSync = async (isFirstLoad: boolean) => {
    // Se for a primeira vez que o componente carrega, usamos 'up' para somar.
    // Se for apenas a atualização automática, usamos 'get' para apenas ler o valor.
    const action = isFirstLoad ? 'up' : 'get';
    const cacheBuster = `t=${Date.now()}`;
    const url = `https://api.counterapi.dev/v1/${SITE_ID}/counter/${action}?${cacheBuster}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error("API Offline");

      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const novoTotal = VALOR_BASE + data.count;
        
        // Se o número que veio do servidor é maior que o que temos, animamos as peças
        if (novoTotal > totalVisits && status !== 'sync') {
          setHasNewEntry(true);
          setTimeout(() => setHasNewEntry(false), 3000);
        }

        setTotalVisits(novoTotal);
        setStatus('online');
      }
    } catch (err) {
      console.warn("Aviso: Falha de sincronização. A manter valor local.");
      setStatus('offline');
    }
  };

  useEffect(() => {
    // 1. Tenta somar imediatamente ao entrar
    if (!hasHit.current) {
      performSync(true);
      hasHit.current = true;
    }

    // 2. A cada 10 segundos, verifica se houve novas entradas noutros computadores/browsers
    const interval = setInterval(() => {
      performSync(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [totalVisits]);

  const digits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Luz ambiente de fundo que brilha quando o número muda */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-all duration-1000 ${hasNewEntry ? 'opacity-100 scale-150 bg-blue-500/30' : 'opacity-20'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência Global</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'online' ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
              {status === 'online' ? 'Visitas em Tempo Real' : 'Modo Offline'}
            </span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${status === 'online' ? 'bg-blue-600/10 border-blue-500/20 text-blue-300' : 'bg-red-950/40 border-red-500/20 text-red-400'}`}>
          {status === 'sync' ? 'A LIGAR...' : status === 'online' ? 'LIVE SYNC' : 'REDE INDISP.'}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {digits.map((digit, i) => (
          <div key={`${i}-${digit}-${totalVisits}`} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-500 ${hasNewEntry ? 'border-blue-400/50 -translate-y-1 scale-105 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' : ''}`}>
              {digit}
              {/* Linha de separação de contador mecânico antigo */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center relative z-10">
        <div className={`inline-flex items-center space-x-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${hasNewEntry ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'bg-gray-900/60 text-gray-400 border border-white/5'}`}>
          <div className="flex space-x-1">
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce' : 'animate-pulse'}`} />
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce delay-75' : 'animate-pulse delay-75'}`} />
          </div>
          <span>{hasNewEntry ? 'Entrada Sincronizada' : 'A Monitorizar Rede'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Web Rádio Figueiró • 24H Online
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
