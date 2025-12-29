
import React, { useState, useEffect, useRef } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador de audiência global com sincronização garantida.
 * CORREÇÃO: Removido loop de rede e implementado anti-cache rigoroso para Chrome/Edge.
 */

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 10160;
  
  // Namespace único e novo para evitar conflitos de cache de servidores anteriores
  const API_NAMESPACE = 'webradio_figueiro_v15_final';
  const API_KEY = 'global_visitors';
  const SESSION_KEY = 'wrf_active_session_v15';

  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const [status, setStatus] = useState<'connecting' | 'online' | 'error'>('connecting');
  
  // Ref para garantir que o incremento só acontece UMA vez por carregamento de página
  const hasAttempted = useRef(false);

  const fetchCount = async (isNewVisitor: boolean) => {
    const type = isNewVisitor ? 'up' : 'get';
    // O parâmetro 't' com Date.now() impede que o Edge/Chrome usem dados antigos
    const url = `https://api.counterapi.dev/v1/${API_NAMESPACE}/${API_KEY}/${type}?t=${Date.now()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store', // Vital para sincronização em tempo real
        mode: 'cors',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const newTotal = VALOR_BASE + data.count;
        
        // Se o número for maior que o que temos no ecrã, fazemos a animação
        if (newTotal > totalVisits && status === 'online') {
          setHasNewEntry(true);
          setTimeout(() => setHasNewEntry(false), 4000);
        }

        setTotalVisits(newTotal);
        setStatus('online');

        // Se somámos com sucesso, marcamos a sessão para não somar mais (até fechar o browser)
        if (isNewVisitor) {
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
      }
    } catch (err) {
      console.error("Erro na sincronização de audiência");
      setStatus('error');
    }
  };

  useEffect(() => {
    // Executa apenas uma vez ao montar o componente
    if (!hasAttempted.current) {
      const isAlreadyInSession = sessionStorage.getItem(SESSION_KEY);
      
      // Pequeno delay para garantir que a rede está estável antes de somar
      setTimeout(() => {
        fetchCount(!isAlreadyInSession);
      }, 800);
      
      hasAttempted.current = true;
    }

    // Polling: Verifica o servidor a cada 15 segundos para atualizar o número se outros entrarem
    const interval = setInterval(() => {
      fetchCount(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []); // Dependência vazia = Executa apenas ao abrir a página

  const digits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/40 group">
      {/* Luz ambiente de fundo que brilha quando alguém entra */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/10 blur-[70px] rounded-full transition-all duration-1000 ${hasNewEntry ? 'opacity-100 scale-150 bg-blue-500/20' : 'opacity-20'}`} />
      
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
        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-colors ${status === 'online' ? 'bg-blue-600/10 border-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-500 border-white/5'}`}>
          {status === 'connecting' ? 'A Ligar...' : 'Live Global'}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {digits.map((digit, i) => (
          <div key={`${i}-${digit}-${totalVisits}`} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-700 ${hasNewEntry ? 'border-blue-400/50 -translate-y-1 scale-105 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)]' : ''}`}>
              {digit}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center relative z-10">
        <div className={`inline-flex items-center space-x-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${hasNewEntry ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' : 'bg-gray-900/60 text-gray-400 border border-white/5'}`}>
          <div className="flex space-x-1">
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce' : 'animate-pulse'}`} />
            <span className={`h-1.5 w-1.5 bg-blue-500 rounded-full ${hasNewEntry ? 'animate-bounce delay-75' : 'animate-pulse delay-75'}`} />
          </div>
          <span>{hasNewEntry ? 'Novo Ouvinte na Rede' : 'A Monitorizar Visitas'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
          Web Rádio Figueiró • Sempre Consigo
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
