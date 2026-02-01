
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
    // Evita pedidos em excesso se já temos notícias recentes (5 min)
    if (isSyncing || (Date.now() - lastUpdate.current < 300000 && hasRealNews)) return;
    
    setIsSyncing(true);
    
    // Timeout alargado para 45s pois a pesquisa web em produção pode demorar
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const result: any = await fetchLatestNews();
      clearTimeout(timeoutId);
      
      if (result && result.text) {
        const items = result.text
          .split('\n')
          .map((line: string) => {
            return line
              .replace(/^[0-9\-\*\#\.\s]+/, '') // Remove marcadores de lista
              .replace(/[*#`_]/g, '')           // Remove formatação markdown
              .trim();
          })
          .filter((title: string) => {
            const lower = title.toLowerCase();
            // Filtro menos restritivo (mínimo 10 caracteres)
            return title.length > 10 && 
                   !lower.includes("aqui estão") && 
                   !lower.includes("claro") &&
                   !lower.includes("pesquisa");
          });
        
        if (items.length >= 2) {
          setNewsText(items);
          setHasRealNews(true);
          lastUpdate.current = Date.now();
          console.log("NewsTicker: Notícias locais sincronizadas com sucesso.");
        } else {
           console.warn("NewsTicker: IA não devolveu notícias válidas.");
        }
      }
    } catch (error: any) {
      console.warn("NewsTicker: Falha na ligação. Mantendo mensagens da rádio.");
      // Se falhou, permite nova tentativa daqui a 1 minuto
      if (!hasRealNews) lastUpdate.current = Date.now() - 240000;
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Primeira tentativa 5 segundos após carregar
    const timer = setTimeout(loadTickerData, 5000);
    // Verificação de rotina a cada 10 minutos
    const interval = setInterval(loadTickerData, 600000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      {/* Badge de Estado */}
      <div className={`h-full px-6 flex items-center z-20 shadow-[10px_0_20px_rgba(0,0,0,0.3)] relative shrink-0 transition-colors duration-700 ${isSyncing ? 'bg-blue-600' : 'bg-red-600'}`}>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center">
          {isSyncing ? (
            <span className="flex space-x-1 mr-3">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </span>
          ) : (
            <span className={`w-2 h-2 rounded-full mr-2 ${hasRealNews ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`}></span>
          )}
          <span>{isSyncing ? 'A Sintonizar' : (hasRealNews ? 'Direto Amarante' : 'Última Hora')}</span>
        </span>
        <div className={`absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] transition-colors duration-500 ${isSyncing ? 'border-l-blue-600' : 'border-l-red-600'}`}></div>
      </div>
      
      {/* Scroll de Notícias */}
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
          animation: ticker-infinite 160s linear infinite;
        }
        .animate-ticker-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
