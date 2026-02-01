
import React, { useState, useEffect, useRef } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const FALLBACK_TICKER = [
    "Web Rádio Figueiró: A sua melhor companhia em Amarante e no Mundo",
    "Sintonize a excelência sonora com a WRF Digital - Emissão 24 horas por dia",
    "Peça a sua música favorita através do nosso WhatsApp: +351 910 270 085",
    "WRF: Elevando a voz de Amarante para todos os corações através da música",
    "Cultura e Informação: Acompanhe as novidades da nossa região aqui na Figueiró"
  ];

  const [newsText, setNewsText] = useState<string[]>(FALLBACK_TICKER);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasRealNews, setHasRealNews] = useState(false);
  const lastUpdate = useRef<number>(0);

  const loadTickerData = async () => {
    // Evita pedidos em excesso se já temos notícias sincronizadas recentemente
    if (isSyncing || (Date.now() - lastUpdate.current < 600000 && hasRealNews)) return;
    
    setIsSyncing(true);
    
    try {
      const result: any = await fetchLatestNews();
      
      if (result && result.text) {
        const items = result.text
          .split('\n')
          .map((line: string) => {
            return line
              .replace(/^[0-9\-\*\#\.\s]+/, '') // Remove listas (1., -, *)
              .replace(/[*#`_]/g, '')           // Remove markdown
              .trim();
          })
          .filter((title: string) => {
            // Filtra ruído e frases genéricas da IA
            const lower = title.toLowerCase();
            return title.length > 10 && 
                   !lower.includes("aqui estão") && 
                   !lower.includes("notícias") &&
                   !lower.includes("claro");
          });
        
        if (items.length >= 2) {
          setNewsText(items);
          setHasRealNews(true);
          lastUpdate.current = Date.now();
        }
      }
    } catch (error: any) {
      console.warn("NewsTicker Sync: A usar conteúdo de reserva devido a limite de cota ou rede.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Delay inicial maior para garantir que o ambiente está pronto
    const timer = setTimeout(loadTickerData, 8000);
    // Tenta atualizar a cada 15 minutos
    const interval = setInterval(loadTickerData, 900000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      {/* Badge de Estado Dinâmico */}
      <div className={`h-full px-6 flex items-center z-20 shadow-[10px_0_20px_rgba(0,0,0,0.3)] relative shrink-0 transition-all duration-700 ${isSyncing ? 'bg-blue-600' : (hasRealNews ? 'bg-red-600' : 'bg-slate-800')}`}>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center">
          {isSyncing ? (
            <span className="flex space-x-1 mr-3">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </span>
          ) : (
            <span className={`w-2 h-2 rounded-full mr-2 ${hasRealNews ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`}></span>
          )}
          <span>{isSyncing ? 'A Sintonizar' : (hasRealNews ? 'Direto Amarante' : 'WRF INFO')}</span>
        </span>
        <div className={`absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] transition-colors duration-500 ${isSyncing ? 'border-l-blue-600' : (hasRealNews ? 'border-l-red-600' : 'border-l-slate-800')}`}></div>
      </div>
      
      {/* Scroll Infinito */}
      <div className="flex-grow relative h-full flex items-center">
        <div className="animate-ticker-infinite flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-white dark:text-gray-100 text-[10px] md:text-[11px] font-bold tracking-tight uppercase px-12">
                {text}
              </span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-blue-500 font-black text-[9px] px-8 tracking-tighter">WRF NEWS</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-ticker-infinite {
          display: inline-flex;
          animation: ticker-infinite 170s linear infinite;
        }
        .animate-ticker-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
