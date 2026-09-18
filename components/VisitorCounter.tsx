
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chave única e dedicada da Web Rádio Figueiró
const COUNTER_KEY = 'wrf_figueiro_audiencia_2026';
const VALOR_BASE = 13540;
const STORAGE_KEY = 'wrf_vcount_v4_persist';

const getSafeStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setSafeStorage = (key: string, val: string): void => {
  try {
    localStorage.setItem(key, val);
  } catch {
    // Ignora restrições de privacidade ou quota em Safari iOS
  }
};

const VisitorCounter: React.FC = () => {
  const [totalVisits, setTotalVisits] = useState<number>(() => {
    if (typeof window === 'undefined') return VALOR_BASE;
    const savedV4 = getSafeStorage(STORAGE_KEY);
    if (savedV4) return Math.max(parseInt(savedV4, 10) || VALOR_BASE, VALOR_BASE);
    const savedV3 = getSafeStorage('wrf_vcount_v3_persist');
    if (savedV3) return Math.max(parseInt(savedV3, 10) || VALOR_BASE, VALOR_BASE);
    return VALOR_BASE;
  });

  const [hasNewEntry, setHasNewEntry] = useState(false);
  const isSyncing = useRef(false);
  const hasMounted = useRef(false);

  const triggerEntryEffect = useCallback(() => {
    setHasNewEntry(true);
    const timer = setTimeout(() => setHasNewEntry(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const performSync = useCallback(async (action: 'hit' | 'get') => {
    if (isSyncing.current && action === 'get') return;
    isSyncing.current = true;

    try {
      // 1. Tentar a API principal com CORS global e sem cache
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://countapi.mileshilliard.com/api/v1/${action}/${COUNTER_KEY}?_ts=${Date.now()}`;
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.value === 'number') {
          const serverValue = Math.max(data.value, VALOR_BASE);
          setTotalVisits(current => {
            if (serverValue > current) {
              triggerEntryEffect();
              setSafeStorage(STORAGE_KEY, serverValue.toString());
              return serverValue;
            }
            return current;
          });
          isSyncing.current = false;
          return;
        }
      }
      throw new Error('Falha no serviço principal');
    } catch {
      // 2. Fallback de contingência caso haja instabilidade de rede no telemóvel
      if (action === 'hit') {
        setTotalVisits(prev => {
          const next = prev + 1;
          triggerEntryEffect();
          setSafeStorage(STORAGE_KEY, next.toString());
          return next;
        });
      }
    } finally {
      isSyncing.current = false;
    }
  }, [triggerEntryEffect]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;

      // No telemóvel, as abas do navegador ficam abertas continuamente em segundo plano.
      // Verificamos o tempo desde a última entrada registada neste dispositivo.
      const now = Date.now();
      const lastEntryStr = getSafeStorage('wrf_last_entry_ts');
      const lastEntry = lastEntryStr ? parseInt(lastEntryStr, 10) : 0;

      // Se passaram mais de 20 segundos desde a última entrada (ou é a primeira visita),
      // conta como nova entrada no site
      const shouldCountAsEntry = !lastEntry || (now - lastEntry > 20000);

      if (shouldCountAsEntry) {
        setSafeStorage('wrf_last_entry_ts', now.toString());
        performSync('hit');
      } else {
        performSync('get');
      }
      setSafeStorage('wrf_last_active_ts', now.toString());
    }

    // Deteção de re-entrada no telemóvel (quando o utilizador volta à aba depois de usar outra app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const lastActiveStr = getSafeStorage('wrf_last_active_ts');
        const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;

        // Se esteve fora mais de 3 minutos e voltou ao site, conta como nova entrada
        if (lastActive && (now - lastActive > 180000)) {
          setSafeStorage('wrf_last_entry_ts', now.toString());
          performSync('hit');
        } else {
          performSync('get');
        }
        setSafeStorage('wrf_last_active_ts', now.toString());
      } else {
        setSafeStorage('wrf_last_active_ts', Date.now().toString());
      }
    };

    // Deteção quando a página é restaurada do cache de navegação do telemóvel (bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        performSync('hit');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    // Sincronização em tempo real (a cada 25 segundos) para manter PC e telemóvel alinhados
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        performSync('get');
      }
    }, 25000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      clearInterval(interval);
    };
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
            className={`bg-[#05070c] text-white text-2xl sm:text-3xl font-mono font-black w-9 sm:w-11 h-12 sm:h-14 flex items-center justify-center rounded-xl border border-white/10 shadow-inner transition-all duration-300 ${
              hasNewEntry ? 'text-red-400 scale-105 border-red-500/40 shadow-red-500/20' : ''
            }`}
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
