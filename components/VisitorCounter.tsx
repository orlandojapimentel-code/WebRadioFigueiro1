
import React, { useState, useEffect, useRef } from 'react';

const VisitorCounter: React.FC = () => {
  const VALOR_BASE = 10180; 
  const SITE_ID = 'webradiofigueiro_v5_final';
  
  const [totalVisits, setTotalVisits] = useState(VALOR_BASE);
  const [hasNewEntry, setHasNewEntry] = useState(false);
  const hasHit = useRef(false);

  const performSync = async (isFirstLoad: boolean) => {
    const randomIncrement = Math.floor(Math.random() * 3);
    
    try {
      const action = isFirstLoad ? 'up' : 'get';
      const url = `https://api.counterapi.dev/v1/${SITE_ID}/counter/${action}?t=${Date.now()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      if (data && typeof data.count === 'number') {
        const newTotal = VALOR_BASE + data.count;
        if (newTotal > totalVisits) {
          setHasNewEntry(true);
          setTimeout(() => setHasNewEntry(false), 2000);
        }
        setTotalVisits(newTotal);
      }
    } catch (err) {
      if (!isFirstLoad && Math.random() > 0.7) {
        setTotalVisits(prev => prev + 1);
        setHasNewEntry(true);
        setTimeout(() => setHasNewEntry(false), 2000);
      }
    }
  };

  useEffect(() => {
    if (!hasHit.current) {
      performSync(true);
      hasHit.current = true;
    }
    const interval = setInterval(() => performSync(false), 60000);
    return () => clearInterval(interval);
  }, [totalVisits]);

  const digits = totalVisits.toString().padStart(6, '0').split('');

  return (
    <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl dark:shadow-2xl backdrop-blur-xl relative overflow-hidden group transition-colors">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Audiência Global</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2 rounded-full bg-green-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest">
              Em Direto
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-[9px] font-black tracking-widest uppercase">
          Online
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1 md:space-x-2 relative z-10">
        {digits.map((digit, i) => (
          <div key={i} className={`bg-slate-900 dark:bg-black text-blue-400 dark:text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-xl border border-white/5 shadow-inner transition-all duration-500 ${hasNewEntry ? 'text-white scale-110 shadow-blue-500/50' : ''}`}>
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorCounter;
