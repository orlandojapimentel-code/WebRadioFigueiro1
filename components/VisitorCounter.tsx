
import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  // CONFIGURAÇÃO BASE
  const STARTING_NUMBER = 10160;
  
  /**
   * DATA DE LANÇAMENTO (Reference Date)
   * Definimos uma data próxima para garantir que o crescimento "global" 
   * comece exatamente a partir de hoje.
   */
  const REFERENCE_DATE = new Date('2024-05-20T10:00:00').getTime(); 
  
  // Taxa de crescimento: 1 visita simulada a cada 4 horas (para realismo)
  const GROWTH_RATE_MS = 1000 * 60 * 60 * 4; 

  const [count, setCount] = useState(STARTING_NUMBER);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    // 1. Calcular Visitas Globais Simuladas (baseado no tempo)
    const getGlobalSimulated = () => {
      const now = Date.now();
      const elapsed = now - REFERENCE_DATE;
      // Garantimos que não é negativo caso a data de sistema esteja errada
      const simulated = Math.max(0, Math.floor(elapsed / GROWTH_RATE_MS));
      return simulated;
    };

    // 2. Processar Visita Local (Persistente)
    const handleLocalVisit = () => {
      // Contador persistente total de todos os utilizadores (simulado localmente)
      // No mundo real isto viria de uma API. Aqui simulamos somando ao localStorage.
      const storedTotal = localStorage.getItem('wrf_total_visits_v1');
      let totalVisits = storedTotal ? parseInt(storedTotal) : STARTING_NUMBER;

      // Se for uma nova sessão (aba fechada e aberta), incrementamos o valor persistente
      if (!sessionStorage.getItem('wrf_session_active')) {
        totalVisits += 1;
        localStorage.setItem('wrf_total_visits_v1', totalVisits.toString());
        sessionStorage.setItem('wrf_session_active', 'true');
        
        // Ativar animação de entrada
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 3000);
      }
      
      return totalVisits;
    };

    const currentLocalTotal = handleLocalVisit();
    const finalDisplayCount = currentLocalTotal + getGlobalSimulated();
    
    setCount(finalDisplayCount);

    // 3. Simulação de tráfego em tempo real (Enquanto a página está aberta)
    const interval = setInterval(() => {
      // 5% de chance de alguém "entrar" a cada 30 segundos
      if (Math.random() > 0.95) {
        setCount(prev => prev + 1);
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 1500);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Formatação para 6 dígitos
  const digits = count.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-blue-500/40">
      {/* Glow Effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full transition-opacity duration-1000 ${isIncrementing ? 'opacity-100' : 'opacity-30'}`} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Auditório Total</span>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Em Direto</span>
          </div>
        </div>
        <div className="bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[9px] text-blue-300 font-black uppercase">Web Rádio Figueiró</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1.5 md:space-x-2">
        {digits.map((digit, i) => (
          <div key={i} className="relative">
            <div className="relative bg-gradient-to-b from-gray-800 to-black text-blue-400 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-2xl flex items-center justify-center min-w-[42px] md:min-w-[54px] overflow-hidden">
              <span className={`transition-all duration-700 ${isIncrementing ? 'scale-125 text-white brightness-150' : ''}`}>
                {digit}
              </span>
              {/* Efeito Odómetro/Vidro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/80 z-10" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center space-y-3">
        <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${isIncrementing ? 'bg-blue-600 text-white' : 'bg-gray-900/60 text-gray-500'}`}>
          {isIncrementing ? 'Novo Ouvinte Conectado!' : 'Estatísticas de Audiência'}
        </div>
        <p className="text-[9px] text-gray-600 font-medium italic">
          Obrigado por fazer parte da nossa história.
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
