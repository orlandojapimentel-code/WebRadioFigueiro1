
import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  // Configurações do Contador
  const START_COUNT = 10160;
  const START_DATE = new Date('2024-01-01T00:00:00').getTime(); // Data de referência
  const VISITS_PER_HOUR = 1.2; // Média de visitas simuladas por hora para crescimento orgânico

  const [count, setCount] = useState(START_COUNT);

  useEffect(() => {
    // 1. Calcular crescimento baseado no tempo (Simulação Global)
    const now = Date.now();
    const hoursElapsed = (now - START_DATE) / (1000 * 60 * 60);
    const timeBasedGrowth = Math.floor(hoursElapsed * VISITS_PER_HOUR);

    // 2. Obter visitas locais guardadas
    const storedVisits = localStorage.getItem('radio_figueiro_local_visits');
    let localSessionCount = storedVisits ? parseInt(storedVisits) : 0;
    
    // Incrementar +1 para a visita atual se for uma nova sessão
    if (!sessionStorage.getItem('session_counted')) {
      localSessionCount += 1;
      localStorage.setItem('radio_figueiro_local_visits', localSessionCount.toString());
      sessionStorage.setItem('session_counted', 'true');
    }

    const initialTotal = START_COUNT + timeBasedGrowth + localSessionCount;
    setCount(initialTotal);

    // 3. Simulação de Tráfego em Tempo Real (novas visitas enquanto navega)
    const interval = setInterval(() => {
      // Chance de 30% de aumentar um visitante a cada 45 segundos
      if (Math.random() > 0.7) {
        setCount(prev => prev + 1);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Formatar número para ter pelo menos 6 dígitos (ex: 010161)
  const formattedCount = count.toString().padStart(6, '0');

  return (
    <div className="bg-gray-800/50 p-6 rounded-3xl border border-blue-500/20 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Audiência Global</p>
        <div className="flex items-center space-x-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] text-green-500 font-bold uppercase">Live</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2">
        {formattedCount.split('').map((digit, i) => (
          <div key={i} className="relative group">
            <div className="absolute -inset-0.5 bg-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gray-900 text-blue-400 text-2xl md:text-4xl font-mono font-black px-2.5 py-3 md:px-3 md:py-4 rounded-xl border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] flex items-center justify-center min-w-[32px] md:min-w-[45px]">
              <span className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                {digit}
              </span>
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/40"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex flex-col items-center">
        <p className="text-[11px] text-gray-400 font-medium text-center leading-relaxed">
          Sintonizados agora e desde o início da nossa emissão.
        </p>
        <div className="mt-2 flex items-center space-x-4">
           <div className="text-center">
             <p className="text-[9px] text-gray-500 uppercase font-bold">Total Entradas</p>
             <p className="text-xs text-blue-300 font-bold italic">#{count}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
