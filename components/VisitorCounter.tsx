
import React, { useState, useEffect, useRef } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador de audiência global com sincronização garantida e anti-cache.
 */

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 10160;
  
  // Namespace novo para garantir um arranque sem cache de versões falhadas
  const API_NAMESPACE = 'webradio_figueiro_v25_final';
  const API_KEY = 'audiencia_real';
  const SESSION_TOKEN = 'wrf_session_token_v25';

  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const [status, setStatus] = useState<'connecting' | 'online' | 'error'>('connecting');
  
  const initialized = useRef(false);

  const syncAudiencia = async (isNew: boolean) => {
    const action = isNew ? 'up' : 'get';
    // O parâmetro 'v' força o browser a ignorar qualquer versão guardada do número
    const cacheBuster = `v=${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const url = `https://api.counterapi.dev/v1/${API_NAMESPACE}/${API_KEY}/${action}?${cacheBuster}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        mode: 'cors',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const newTotal = VALOR_BASE + data.count;
        
        // Efeito visual se o número subir enquanto o utilizador está a olhar
        if (newTotal > totalVisits && status === 'online') {
          setHasNewEntry(true);
          setTimeout(() => setHasNewEntry(false), 3000);
        }

        setTotalVisits(newTotal);
        setStatus('online');

        if (isNew) {
          localStorage.setItem(SESSION_TOKEN, 'active');
        }
      }
    } catch (err) {
      console.warn("Aviso: Falha na sincronização de rede.");
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      // Verifica se este browser já contou esta visita
      const isAlreadyCounted = localStorage.getItem(SESSION_TOKEN);
      
      // Sincroniza imediatamente
      syncAudiencia(!isAlreadyCounted);
      initialized.current = true;
    }

    // Verifica novos ouvintes vindos de outros navegadores a cada 10 segundos
    const poller = setInterval(() => {
      syncAudiencia(false);
    }, 10000);

    return () => clearInterval(poller);
  }, [totalVisits, status]);

  const digits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/40 group">
      {/* Brilho dinâmico de fundo */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-all duration-1000 ${hasNewEntry ? 'opacity-100 scale-150 bg-blue-400/20' : 'opacity-20'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência em Direto</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'online' ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Visitas Sincronizadas</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${status === 'online' ? 'bg-blue-600/10 border-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-500 border-white/5'}`}>
          {status === 'online' ? 'LIVE GLOBAL' : 'SINCRO...'}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {digits.map((digit, i) => (
          <div key={`${i}-${digit}-${totalVisits}`} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-500 ${hasNewEntry ? 'border-blue-400/50 -translate-y-1 scale-105 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]' : ''}`}>
              {digit}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center relative z-10">
        <div className={`inline-flex items-center space-x-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${hasNewEntry ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-900/60 text-gray-400 border border-white/5'}`}>
          <div className="flex space-x-1">
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce' : 'animate-pulse'}`} />
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce delay-75' : 'animate-pulse delay-75'}`} />
          </div>
          <span>{hasNewEntry ? 'Novo Ouvinte Conetado' : 'A Monitorizar Visitas'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Web Rádio Figueiró • Sempre Consigo
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
