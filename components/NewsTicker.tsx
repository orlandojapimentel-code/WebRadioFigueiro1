
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [newsText, setNewsText] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  const FALLBACK_TICKER = [
    "Bem-vindo à Web Rádio Figueiró: A sua melhor companhia em Amarante e no Mundo",
    "Sintonize a excelência sonora com a WRF Digital - Emissão 24 horas por dia",
    "Peça a sua música favorita e envie a sua dedicatória através do nosso painel de pedidos",
    "WRF: Elevando a voz de Amarante para todos os corações através da música",
    "Cultura e Informação: Acompanhe as novidades da nossa região aqui na Figueiró"
  ];

  const loadTickerData = async () => {
    setIsSyncing(true);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 7000)
    );

    try {
      const result: any = await Promise.race([
        fetchLatestNews(),
        timeoutPromise
      ]);
      
      if (result && result.text) {
        const items = result.text.split('\n')
          .map((line: string) => line.replace(/[*#`\d.\-]/g, '').trim())
          .filter((title: string) => title.length > 15 && !title.toLowerCase().includes('aqui estão'));
        
        if (items.length > 0) {
          setNewsText(items);
        } else {
          setNewsText(FALLBACK_TICKER);
        }
      } else {
        setNewsText(FALLBACK_TICKER);
      }
    } catch (error) {
      setNewsText(FALLBACK_TICKER);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadTickerData();
    const interval = setInterval(loadTickerData, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  const currentNews = newsText.length > 0 ? newsText : FALLBACK_TICKER;
  const displayItems = [...currentNews, ...currentNews, ...currentNews];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[8px_0_20px_rgba(220,38,38,0.4)] relative shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse whitespace-nowrap">
          {isSyncing && newsText.length === 0 ? 'A Sintonizar' : 'Última Hora'}
        </span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
      <div className="flex-grow relative overflow-hidden h-full flex items-center">
        <div className="animate-ticker-smooth flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center">
              <span className="text-white dark:text-gray-100 text-[10px] md:text-[11px] font-bold tracking-tight uppercase px-12">
                {text}
              </span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-blue-500 font-black text-[9px] px-8 tracking-tighter shrink-0">WRF DIGITAL</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker-smooth {
          display: inline-flex;
          animation: ticker-scroll-smooth 70s linear infinite;
        }
        .animate-ticker-smooth:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
