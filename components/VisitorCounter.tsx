import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
    // Ignore storage restrictions
  }
};

const VisitorCounter: React.FC = () => {
  const { t } = useLanguage();

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

  const performSync = useCallback(
    async (action: 'hit' | 'get') => {
      if (isSyncing.current && action === 'get') return;
      isSyncing.current = true;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const url = `https://countapi.mileshilliard.com/api/v1/${action}/${COUNTER_KEY}?_ts=${Date.now()}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.value === 'number') {
            const serverValue = Math.max(data.value, VALOR_BASE);
            setTotalVisits((current) => {
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
        throw new Error('Counter sync failed');
      } catch {
        if (action === 'hit') {
          setTotalVisits((prev) => {
            const next = prev + 1;
            triggerEntryEffect();
            setSafeStorage(STORAGE_KEY, next.toString());
            return next;
          });
        }
      } finally {
        isSyncing.current = false;
      }
    },
    [triggerEntryEffect]
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      const now = Date.now();
      const lastEntryStr = getSafeStorage('wrf_last_entry_ts');
      const lastEntry = lastEntryStr ? parseInt(lastEntryStr, 10) : 0;
      const shouldCountAsEntry = !lastEntry || now - lastEntry > 20000;

      if (shouldCountAsEntry) {
        setSafeStorage('wrf_last_entry_ts', now.toString());
        performSync('hit');
      } else {
        performSync('get');
      }
      setSafeStorage('wrf_last_active_ts', now.toString());
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const lastActiveStr = getSafeStorage('wrf_last_active_ts');
        const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;

        if (lastActive && now - lastActive > 180000) {
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

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) performSync('hit');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

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
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] block">
            {t.counter.kicker}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {t.counter.activeLabel}
          </span>
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {t.counter.onlineLabel}
        </span>
      </div>

      <div className="flex justify-center items-center gap-1.5 sm:gap-2 py-1 tabular-nums">
        {digits.map((digit, i) => (
          <div
            key={i}
            className={`bg-slate-900 dark:bg-[#05070c] text-white text-2xl font-mono font-bold w-9 sm:w-10 h-12 flex items-center justify-center rounded-xl border border-slate-800 dark:border-white/10 transition-colors ${
              hasNewEntry ? 'text-red-400 border-red-500/40' : ''
            }`}
          >
            {digit}
          </div>
        ))}
      </div>

      <p className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] text-center text-xs text-slate-500 dark:text-slate-400">
        {t.counter.caption}
      </p>
    </div>
  );
};

export default VisitorCounter;
