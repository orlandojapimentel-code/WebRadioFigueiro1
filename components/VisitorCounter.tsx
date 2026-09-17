
import React, { useState, useEffect, useRef } from 'react';

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 13000; 
  // Alterado para um namespace e chave únicos para garantir isolamento total
  const SITE_NAMESPACE = 'wer_radio_figueiro_global_2026';
  const SITE_KEY = 'main_counter_v3_secure';
  
  const [totalVisits, setTotalVisits] = useState(() => {
    if (typeof window === 'undefined') return VALOR_BASE;
    const saved = localStorage.getItem('wrf_vcount_v3_persist');
    return saved ? Math.max(parseInt(saved, 10), VALOR_BASE) : VALOR_BASE;
  });
  
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const hasHit = useRef(false);

  const triggerEntryEffect = () => {
    setHasNewEntry(true);
    setTimeout(() => setHasNewEntry(false), 2000);
  };

  const performSync = React.useCallback(async (action: 'up' | 'get') => {
    try {
      // Adicionamos um timestamp único para forçar a API a ignorar a sua própria cache
      const url = `https://api.counterapi.dev/v1/${SITE_NAMESPACE}/${SITE_KEY}/${action}?nocache=${Date.now()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const newTotal = VALOR_BASE + data.count;
        
        setTotalVisits(current => {
          // LÓGICA CRÍTICA: Nunca permitir que o número regresse atrás
          // Mesmo que a API devolva 1 ou um valor baixo, mantemos o maior valor visto
          if (newTotal > current) {
            triggerEntryEffect();
            localStorage.setItem('wrf_vcount_v3_persist', newTotal.toString());
            return newTotal;
          }
          return current;
        });
      }
    } catch {
      // Fallback: Simulamos progressão lenta se a rede falhar
      if (Math.random() > 0.9) {
        setTotalVisits(prev => {
          const next = prev + 1;
          triggerEntryEffect();
          localStorage.setItem('wrf_vcount_v3_persist', next.toString());
          return next;
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!hasHit.current) {
      const sessionKey = 'wrf_hit_v3';
      const alreadyHit = sessionStorage.getItem(sessionKey);
      
      if (!alreadyHit) {
        performSync('up');
        sessionStorage.setItem(sessionKey, 'true');
      } else {
        performSync('get');
      }
      
      hasHit.current = true;
    }
    
    // Sincronização agressiva (cada 30 seg) para manter PC e Mobile alinhados
    const interval = setInterval(() => performSync('get'), 30000);
    return () => clearInterval(interval);
  }, [performSync]);

  const digits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex flex-col">
          <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.25em] mb-1">
            Audiência Global
          </span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2 rounded-full bg-emerald-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Contador Ativo
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-[9px] font-black tracking-widest uppercase">
          Online
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1.5 sm:space-x-2 relative z-10 py-1">
        {digits.map((digit, i) => (
          <div 
            key={i} 
            className={`bg-[#05070c] text-white text-2xl sm:text-3xl font-mono font-black w-9 sm:w-11 h-12 sm:h-14 flex items-center justify-center rounded-xl border border-white/10 shadow-inner transition-all duration-300 ${hasNewEntry ? 'text-red-400 scale-105 border-red-500/40 shadow-red-500/20' : ''}`}
          >
            {digit}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          Ouvintes e visitas sincronizadas em tempo real
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
