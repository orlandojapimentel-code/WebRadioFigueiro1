
import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  // CONFIGURAÇÃO DO CONTADOR
  const BASE_VALUE = 10160;
  
  // Data de referência (Data em que o contador foi definido como 10160)
  // Usamos uma data recente para que o crescimento comece perto do valor pretendido
  const START_DATE = new Date('2024-02-20T00:00:00').getTime(); 
  
  // Taxa de crescimento simulada (aprox. 1 visita a cada 2 horas de forma global)
  const GROWTH_RATE_MS = 1000 * 60 * 120; 

  const [count, setCount] = useState(BASE_VALUE);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    // 1. Cálculo da componente "Global Simulada"
    const calculateGlobal = () => {
      const now = Date.now();
      const elapsed = now - START_DATE;
      return Math.floor(elapsed / GROWTH_RATE_MS);
    };

    // 2. Cálculo da componente "Local" (entradas deste utilizador)
    const getLocalVisits = () => {
      const stored = localStorage.getItem('wrf_visitor_personal_count');
      let personalCount = stored ? parseInt(stored) : 0;

      // Se for uma nova sessão (abriu o browser ou aba nova), conta +1
      if (!sessionStorage.getItem('wrf_session_active')) {
        personalCount += 1;
        localStorage.setItem('wrf_visitor_personal_count', personalCount.toString());
        sessionStorage.setItem('wrf_session_active', 'true');
        
        // Efeito visual de incremento ao entrar
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 2000);
      }
      return personalCount;
    };

    const totalInitial = BASE_VALUE + calculateGlobal() + getLocalVisits();
    setCount(totalInitial);

    // 3. Simulação de novos acessos enquanto a página está aberta
    // Isso dá a sensação de que outros utilizadores estão a entrar na rádio agora
    const liveTraffic = setInterval(() => {
      // 20% de chance de aumentar 1 a cada 60 segundos
      if (Math.random() > 0.8) {
        setCount(prev => prev + 1);
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 1000);
      }
    }, 60000);

    return () => clearInterval(liveTraffic);
  }, []);

  // Formatar para 6 dígitos (ex: 010160)
  const digits = count.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Luz de fundo decorativa */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full transition-opacity duration-1000 ${isIncrementing ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Contador de Visitas</span>
          <span className="text-[9px] text-gray-500 font-bold">WEB RÁDIO FIGUEIRÓ</span>
        </div>
        <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
          <span className={`h-1.5 w-1.5 rounded-full ${isIncrementing ? 'bg-blue-400 animate-ping' : 'bg-green-500'}`} />
          <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Online</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1.5">
        {digits.map((digit, i) => (
          <div key={i} className="relative group">
            <div className="relative bg-gradient-to-b from-gray-900 to-black text-blue-400 text-3xl md:text-4xl font-mono font-black px-3 py-4 rounded-xl border border-white/10 shadow-2xl flex items-center justify-center min-w-[38px] md:min-w-[48px] overflow-hidden">
              <span className={`transition-transform duration-500 ${isIncrementing ? 'animate-pulse scale-110 text-white' : ''}`}>
                {digit}
              </span>
              {/* Linha de reflexo de vidro */}
              <div className="absolute top-0 left-0 w-full h-[50%] bg-white/5 pointer-events-none" />
              {/* Sombra central estilo odómetro */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60 shadow-[0_0_5px_rgba(0,0,0,1)]" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="px-4 py-1.5 bg-blue-500/5 rounded-full border border-blue-500/10">
          <p className="text-[10px] text-blue-200/60 font-medium italic">
            "Sempre a somar com a sua companhia"
          </p>
        </div>
        <div className="mt-3 flex items-center space-x-2">
           <svg className="w-3 h-3 text-blue-500/50" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
           </svg>
           <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Total de acessos registados</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
