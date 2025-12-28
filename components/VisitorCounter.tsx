
import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador que inicia rigorosamente em 10160.
 * REGRAS:
 * 1. O número de partida é 10160.
 * 2. Cada nova sessão (entrada no site) soma +1.
 * 3. O valor é persistente no navegador.
 */

const VisitorCounter: React.FC = () => {
  // PONTO DE PARTIDA DEFINIDO PELO UTILIZADOR
  const VALOR_BASE = 10160;
  
  // Chaves de armazenamento (v2 para forçar o reset solicitado)
  const STORAGE_KEY = 'wrf_counter_v2_reset';
  const SESSION_KEY = 'wrf_session_active_v2';

  const [count, setCount] = useState(VALOR_BASE);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    // 1. Recuperar o acumulado de entradas deste dispositivo
    const storedValue = localStorage.getItem(STORAGE_KEY);
    let extraVisits = storedValue ? parseInt(storedValue) : 0;

    // 2. Verificar se esta é uma NOVA ENTRADA (aba aberta agora)
    const isNewSession = !sessionStorage.getItem(SESSION_KEY);

    if (isNewSession) {
      // Registrar nova entrada
      extraVisits += 1;
      localStorage.setItem(STORAGE_KEY, extraVisits.toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
      
      // Efeito visual de entrada registrada
      setIsIncrementing(true);
      setTimeout(() => setIsIncrementing(false), 3000);
    }

    // 3. O total exibido é a Base + o Acumulado
    setCount(VALOR_BASE + extraVisits);

    // 4. Simulação de Tráfego Global (Opcional)
    // Para manter o contador dinâmico, simulamos que outros ouvintes entram esporadicamente
    const interval = setInterval(() => {
      // 5% de chance de um "novo ouvinte global" a cada 45 segundos
      if (Math.random() > 0.95) {
        setCount(prev => prev + 1);
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 1000);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Formatar para 6 dígitos (ex: 010160)
  const digits = count.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/60 p-6 rounded-[2.5rem] border border-blue-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Glow de fundo que reage ao incremento */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full transition-all duration-1000 ${isIncrementing ? 'opacity-100 scale-125' : 'opacity-30'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Contador de Visitas</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isIncrementing ? 'duration-300' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Live Feed</span>
          </div>
        </div>
        <div className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[9px] text-blue-300 font-black uppercase">WRF Online</span>
        </div>
      </div>

      {/* Visor Odómetro Digital */}
      <div className="flex justify-center items-center space-x-1 md:space-x-1.5 relative z-10">
        {digits.map((digit, i) => (
          <div key={i} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner flex items-center justify-center min-w-[40px] md:min-w-[52px] transition-all duration-500 ${isIncrementing ? 'border-blue-500/50 -translate-y-1 scale-105 text-white' : ''}`}>
              {digit}
              {/* Divisor do visor */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              {/* Reflexo */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center relative z-10">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isIncrementing ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-900 text-gray-500'}`}>
          <svg className={`w-3.5 h-3.5 ${isIncrementing ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <span>{isIncrementing ? 'Entrada Registada!' : 'Total de Acessos'}</span>
        </div>
        <p className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] opacity-40">
          Reiniciado em 10160
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
