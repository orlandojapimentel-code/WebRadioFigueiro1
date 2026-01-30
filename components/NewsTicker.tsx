
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [newsText, setNewsText] = useState<string[]>([]);

  const loadTickerData = async () => {
    try {
      const result = await fetchLatestNews();
      
      // Nova lógica de extração ultra-resiliente
      // 1. Tenta extrair linhas que não sejam links e tenham tamanho razoável
      const items = result.text.split('\n')
        .map(line => line.replace(/[*#`\d.]/g, '').trim())
        .filter(line => line.length > 25 && !line.toLowerCase().includes('http') && !line.toLowerCase().includes('clique'));
      
      if (items.length > 0) {
        setNewsText(items);
      } else {
        // Fallbacks de qualidade se a extração falhar
        setNewsText([
          "Web Rádio Figueiró: Sintonize as melhores notícias de Amarante e do Mundo",
          "Destaque: Acompanhe a nossa programação especial em direto 24h por dia",
          "Cultura: Fique a par dos eventos mais importantes da nossa região aqui na WRF",
          "WRF Digital: A sua rádio de confiança agora com assistente inteligente"
        ]);
      }
    } catch (error) {
      console.error("Erro no ticker:", error);
      // Fallback em caso de erro total da API
      setNewsText(["Web Rádio Figueiró: A Sintonizar a Melhor Informação de Amarante..."]);
    }
  };

  useEffect(() => {
    loadTickerData();
    const interval = setInterval(loadTickerData, 1800000); // 30 min
    return () => clearInterval(interval);
  }, []);

  // Multiplicamos os itens para garantir um fluxo contínuo sem espaços vazios
  const displayItems = newsText.length > 0 
    ? [...newsText, ...newsText, ...newsText]
    : ["A carregar as últimas notícias de Amarante..."];

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
