
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [newsText, setNewsText] = useState<string[]>([]);

  const loadTickerData = async () => {
    try {
      const result = await fetchLatestNews();
      // Extração resiliente de títulos
      const lines = result.text.split('\n');
      const titles = lines
        .filter(l => l.toLowerCase().includes('tit') || l.toLowerCase().includes('title'))
        .map(l => l.split(':')[1]?.trim().replace(/[*`#]/g, ''))
        .filter(t => t && t.length > 10);
      
      if (titles.length > 0) {
        setNewsText(titles);
      } else {
        // Fallback de títulos para o ticker
        setNewsText([
          "Web Rádio Figueiró: Sintonize a melhor música de Amarante para o Mundo",
          "Destaque: Investimentos no Turismo de Amarante crescem em 2024",
          "Cultura: Museu Amadeo de Souza-Cardoso com novos horários de visita",
          "WRF Digital: A sua companhia constante em qualquer lugar do globo"
        ]);
      }
    } catch (error) {
      console.error("Erro no ticker:", error);
    }
  };

  useEffect(() => {
    loadTickerData();
    const interval = setInterval(loadTickerData, 1800000); 
    return () => clearInterval(interval);
  }, []);

  // Cria um set de itens maior para um scroll infinito sem buracos
  const displayItems = newsText.length > 0 
    ? [...newsText, ...newsText, ...newsText, ...newsText]
    : ["A sintonizar as principais notícias de Amarante...", "Web Rádio Figueiró: A Sua Melhor Companhia...", "A sintonizar as principais notícias de Amarante...", "Web Rádio Figueiró: A Sua Melhor Companhia..."];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[8px_0_20px_rgba(220,38,38,0.4)] relative">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse whitespace-nowrap">Última Hora</span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
      <div className="flex-grow relative overflow-hidden h-full flex items-center">
        <div className="animate-ticker-fast flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center">
              <span className="text-white dark:text-gray-100 text-[10px] md:text-[11px] font-bold tracking-tight uppercase px-12">
                {text}
              </span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-blue-500 font-black text-[9px] px-8 tracking-tighter">WRF DIGITAL</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-fast {
          display: inline-flex;
          /* Velocidade agora em 25s - Dinâmico e Profissional */
          animation: ticker-scroll-fast 25s linear infinite;
        }
        .animate-ticker-fast:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
