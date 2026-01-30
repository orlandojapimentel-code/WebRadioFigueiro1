
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [newsText, setNewsText] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickerData = async () => {
    try {
      const result = await fetchLatestNews();
      const newsBlocks = result.text.split(/NEWS_ITEM|NEWS_START/i).filter(b => b.trim().length > 20);
      
      if (newsBlocks.length > 0) {
        const titles = newsBlocks.map(block => {
          const match = block.match(/(TITLE|TITULO):\s*(.*)/i);
          return match ? match[2].trim().replace(/[*`#]/g, '') : "";
        }).filter(t => t.length > 5);
        setNewsText(titles);
      }
    } catch (error) {
      console.error("Erro no ticker:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickerData();
    const interval = setInterval(loadTickerData, 1800000); 
    return () => clearInterval(interval);
  }, []);

  // Se não houver notícias, mostra uma mensagem padrão para não ficar vazio
  const displayItems = newsText.length > 0 
    ? [...newsText, ...newsText, ...newsText] 
    : ["Web Rádio Figueiró: A sintonizar as principais notícias de Amarante e do Mundo...", "Web Rádio Figueiró: A sintonizar as principais notícias de Amarante e do Mundo..."];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/90 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[8px_0_20px_rgba(220,38,38,0.3)] relative group cursor-pointer">
        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse whitespace-nowrap">Última Hora</span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
      <div className="flex-grow relative overflow-hidden h-full flex items-center">
        <div className="animate-ticker flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center">
              <span className="text-white dark:text-gray-100 text-[11px] font-bold tracking-tight uppercase px-10">
                {text}
              </span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-blue-500 font-black text-[10px] px-6">WRF</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: inline-flex;
          /* Velocidade ajustada de 90s para 35s para ser muito mais dinâmico */
          animation: ticker-scroll 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
