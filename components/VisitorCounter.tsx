
import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador global sincronizado entre diferentes navegadores e dispositivos.
 * TECNOLOGIA: CounterAPI.dev com sistema de polling para atualização em tempo real.
 */

const VisitorCounter: React.FC = () => {
  // O número de partida histórico da rádio
  const VALOR_BASE = 10160;
  
  // Namespace único para garantir que começamos uma contagem limpa e sem cache
  const API_NAMESPACE = 'webradiofigueiro_v3_final';
  const API_KEY = 'main_counter';
  const SESSION_KEY = 'wrf_session_v3_active';

  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  const fetchGlobalCount = async (forceIncrement: boolean) => {
    try {
      // 'up' soma +1 e retorna o valor novo. 'get' apenas lê o valor atual.
      const endpoint = forceIncrement ? 'up' : 'get';
      
      // Cache-buster agressivo com timestamp para enganar o Microsoft Edge
      const url = `https://api.counterapi.dev/v1/${API_NAMESPACE}/${API_KEY}/${endpoint}?t=${Date.now()}`;

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) throw new Error('API Offline');

      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const newTotalFromAPI = VALOR_BASE + data.count;
        
        // Se o valor no servidor é maior do que o que temos no ecrã, atualizamos com animação
        if (newTotalFromAPI > totalVisits && !isSyncing) {
          setHasNewEntry(true);
          setTimeout(() => setHasNewEntry(false), 3000);
        }
        
        setTotalVisits(newTotalFromAPI);
        
        // Se somámos com sucesso, marcamos este browser para não somar mais nesta sessão
        if (forceIncrement) {
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
      }
    } catch (err) {
      console.warn("Sincronização falhou. Usando valor base.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // 1. No arranque: Se não houver sessão ativa, somamos +1. Se houver, apenas lemos.
    const isNewVisitInThisBrowser = !sessionStorage.getItem(SESSION_KEY);
    fetchGlobalCount(isNewVisitInThisBrowser);

    // 2. Polling: Verificar o servidor a cada 30 segundos para apanhar visitas de outros browsers
    const pollInterval = setInterval(() => {
      fetchGlobalCount(false);
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [totalVisits]);

  // Formatação dos dígitos (6 casas decimais)
  const displayDigits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/40 group">
      {/* Glow de fundo que reage a novos visitantes */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-all duration-1000 ${hasNewEntry ? 'opacity-100 scale-125' : 'opacity-30'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência em Direto</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Visitas Sincronizadas</span>
          </div>
        </div>
        <div className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest">
            {isSyncing ? 'Conectando...' : 'LIVE GLOBAL'}
          </span>
        </div>
      </div>

      {/* Visor de Odómetro */}
      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {displayDigits.map((digit, i) => (
          <div key={`${i}-${digit}`} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-700 ${hasNewEntry ? 'border-blue-500/60 -translate-y-1 scale-105 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}>
              {digit}
              {/* Divisor estético do dígito */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              {/* Efeito de brilho no vidro */}
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
          <span>{hasNewEntry ? 'Novo Ouvinte Detetado' : 'A Monitorizar Visitas'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Web Rádio Figueiró • Sempre Consigo
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
