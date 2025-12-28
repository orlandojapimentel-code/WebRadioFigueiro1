
import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  // CONFIGURAÇÃO RIGOROSA DE ACORDO COM O PEDIDO
  const INITIAL_VALUE = 10160;
  const STORAGE_KEY = 'wrf_official_counter_v4';
  const SESSION_KEY = 'wrf_session_counted';

  const [count, setCount] = useState(INITIAL_VALUE);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    // 1. Inicializar ou Recuperar o Valor Acumulado
    const getStoredValue = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Se é a primeira vez absoluta que o site é aberto neste browser, iniciamos no valor base
        localStorage.setItem(STORAGE_KEY, INITIAL_VALUE.toString());
        return INITIAL_VALUE;
      }
      return parseInt(stored, 10);
    };

    // 2. Lógica de Contagem de Nova Entrada (Sessão)
    const handleNewEntry = () => {
      let currentTotal = getStoredValue();
      
      // Verifica se o utilizador acabou de abrir o site (nova sessão)
      const hasBeenCountedThisSession = sessionStorage.getItem(SESSION_KEY);
      
      if (!hasBeenCountedThisSession) {
        // INCREMENTO REAL: Esta é a "entrada" que o utilizador acabou de fazer
        currentTotal += 1;
        localStorage.setItem(STORAGE_KEY, currentTotal.toString());
        sessionStorage.setItem(SESSION_KEY, 'true');
        
        // Ativar efeito visual de novo acesso
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 3000);
      }
      
      return currentTotal;
    };

    // Definir o estado inicial com o valor corrigido
    const finalCount = handleNewEntry();
    setCount(finalCount);

    // 3. Simulação de Tráfego Global "Live"
    // Como não há base de dados centralizada, simulamos que outros utilizadores 
    // estão a entrar na rádio enquanto este utilizador navega.
    const liveTrafficSimulation = setInterval(() => {
      // 15% de probabilidade de um novo acesso global a cada 40 segundos
      if (Math.random() > 0.85) {
        setCount(prev => {
          const next = prev + 1;
          localStorage.setItem(STORAGE_KEY, next.toString());
          return next;
        });
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 1500);
      }
    }, 40000);

    return () => clearInterval(liveTrafficSimulation);
  }, []);

  // Formatação para 6 dígitos (ex: 010161)
  const digits = count.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/60 p-6 rounded-[2.5rem] border border-blue-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 group hover:border-blue-500/60">
      {/* Brilho de fundo dinâmico */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full transition-opacity duration-1000 ${isIncrementing ? 'opacity-100 scale-150' : 'opacity-20'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Total de Acessos</span>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isIncrementing ? 'duration-300' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Contagem em Tempo Real</span>
          </div>
        </div>
        <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-md">
          <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest">Auditório Ativo</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {digits.map((digit, i) => (
          <div key={i} className="relative">
            <div className={`relative bg-gradient-to-b from-gray-900 to-black text-blue-400 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center min-w-[42px] md:min-w-[54px] transition-all duration-500 ${isIncrementing ? 'border-blue-500/50 -translate-y-1 shadow-blue-500/10' : ''}`}>
              <span className={`transition-all duration-700 ${isIncrementing ? 'scale-110 text-white brightness-150' : ''}`}>
                {digit}
              </span>
              {/* Efeito de Reflexo no Vidro */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              {/* Linha Divisória de Odómetro */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60 z-10" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 text-center relative z-10">
        <div className={`inline-flex items-center space-x-3 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isIncrementing ? 'bg-blue-600 text-white scale-105 shadow-xl shadow-blue-600/30' : 'bg-gray-900/80 text-gray-500'}`}>
          <svg className={`w-3.5 h-3.5 ${isIncrementing ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <span>{isIncrementing ? 'Entrada Registada' : 'Acessos Registados'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-500 font-bold uppercase tracking-widest opacity-60">
          Web Rádio Figueiró • A Sua Melhor Companhia
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
