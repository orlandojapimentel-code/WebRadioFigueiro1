
import React, { useState, useEffect, useRef } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  // Conteúdo padrão de alta qualidade para garantir que o site nunca fique vazio
  const FALLBACK_TICKER = [
    "Web Rádio Figueiró: A sua melhor companhia em Amarante e no Mundo",
    "Sintonize a excelência sonora com a WRF Digital - Emissão 24 horas por dia",
    "Peça a sua música favorita através do nosso WhatsApp: +351 910 270 085",
    "WRF: Elevando a voz de Amarante para todos os corações através da música",
    "Cultura e Informação: Acompanhe as novidades da nossa região aqui na Figueiró"
  ];

  const [newsText, setNewsText] = useState<string[]>(FALLBACK_TICKER);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastUpdate = useRef<number>(0);

  const loadTickerData = async () => {
    // Evita múltiplos pedidos simultâneos ou num intervalo inferior a 2 minutos
    if (isSyncing || (Date.now() - lastUpdate.current < 120000 && lastUpdate.current !== 0)) return;
    
    setIsSyncing(true);
    
    // Timeout de 35 segundos: a pesquisa web da Google pode ser lenta no nível gratuito
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const result: any = await fetchLatestNews();
      clearTimeout(timeoutId);
      
      if (result && result.text) {
        const items = result.text
          .split('\n')
          .map((line: string) => line.replace(/^[0-9\-\*\#\.\s]+/, '').replace(/[*#`_]/g, '').trim())
          .filter((title: string) => title.length > 15);
        
        if (items.length >= 2) {
          setNewsText(items);
          lastUpdate.current = Date.now();
          console.log("NewsTicker: Notícias de Amarante atualizadas com sucesso.");
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn("NewsTicker: A pesquisa web demorou mais de 35s. A manter conteúdo atual.");
      } else {
        console.warn("NewsTicker: Falha na sincronização (pode ser limite de quota da API).");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Carregamento inicial com delay para não sobrecarregar o arranque do site
    const timer = setTimeout(loadTickerData, 6000);
    
    // Tenta atualizar a cada 15 minutos
    const interval = setInterval(loadTickerData, 900000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Triplicamos os itens para garantir que o scroll infinito não tenha "saltos" visíveis
  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      {/* Etiqueta ÚLTIMA HORA com indicador de rede */}
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[10px_0_20px_rgba(220,38,38,0.3)] relative shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center">
          {isSyncing ? (
            <span className="flex space-x-1 mr-3">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
            </span>
          ) : (
            <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
          )}
          <span>{isSyncing ? 'Sincronizar' : 'Última Hora'}</span>
        </span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
      {/* Texto em movimento */}
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
          animation: ticker-infinite 150s linear infinite;
        }
        .animate-ticker-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
