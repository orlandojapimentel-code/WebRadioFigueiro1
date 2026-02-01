
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
  const [syncError, setSyncError] = useState(false);
  
  const retryCount = useRef(0);
  // Using ReturnType<typeof setTimeout> to handle timeout IDs correctly in both browser and Node environments
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTickerData = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    // Não limpamos o syncError imediatamente para evitar que o badge "pisque" se falhar logo a seguir
    
    try {
      const result: any = await fetchLatestNews();
      
      if (result && result.text) {
        const items = result.text
          .split('\n')
          .map((line: string) => {
            return line
              .replace(/^[0-9\-\*\#\.\s•]+/, '') // Remove prefixos comuns de lista
              .replace(/[*#`_]/g, '')           // Remove formatação
              .trim();
          })
          .filter((title: string) => {
            const lower = title.toLowerCase();
            return title.length > 15 && 
                   !lower.includes("aqui estão") && 
                   !lower.includes("notícias encontradas") &&
                   !lower.includes("claro");
          });
        
        if (items.length >= 1) {
          // Mix com fallback para garantir um scroll fluído e longo
          const finalItems = items.length < 3 
            ? [...items, ...FALLBACK_TICKER.slice(0, 2)]
            : items;
            
          setNewsText(finalItems);
          setHasRealNews(true);
          setSyncError(false);
          retryCount.current = 0;
          console.log("NewsTicker: Sincronização bem-sucedida.");
        } else {
          throw new Error("Processamento resultou em lista vazia.");
        }
      }
    } catch (error: any) {
      retryCount.current += 1;
      console.warn(`NewsTicker: Falha na tentativa ${retryCount.current}`);
      
      // Só mostramos o estado de erro após 3 falhas reais
      if (retryCount.current >= 3) {
        setSyncError(true);
        setHasRealNews(false);
      }

      // Agendamos uma retentativa rápida se estivermos em erro (30 segundos)
      if (retryCount.current < 5) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(loadTickerData, 30000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Primeira tentativa aos 4 segundos para dar tempo ao sistema de carregar
    const initialTimer = setTimeout(loadTickerData, 4000);
    
    // Ciclo normal de 15 minutos se tudo estiver bem
    const interval = setInterval(() => {
      if (retryCount.current === 0) loadTickerData();
    }, 900000);
    
    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(interval);
    };
  }, []);

  // Multiplicamos os itens para garantir que o loop infinito não tenha "gaps"
  const displayItems = newsText.length > 0 ? [...newsText, ...newsText, ...newsText] : [];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      {/* Badge OLED Dinâmico */}
      <div className={`h-full px-6 flex items-center z-20 shadow-[10px_0_20px_rgba(0,0,0,0.3)] relative shrink-0 transition-all duration-700 
        ${isSyncing ? 'bg-blue-600' : (hasRealNews ? 'bg-red-600' : (syncError ? 'bg-amber-600' : 'bg-slate-800'))}`}>
        
        <div className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center">
          {isSyncing ? (
            <div className="flex space-x-1 mr-3">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
            </div>
          ) : (
            <div className={`w-2 h-2 rounded-full mr-2 ${hasRealNews ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`}></div>
          )}
          <span>
            {isSyncing ? 'Sincronizando' : (hasRealNews ? 'Direto Amarante' : (syncError ? 'Sinal Fraco' : 'WRF Info'))}
          </span>
        </div>
        
        {/* Triângulo de corte do badge */}
        <div className={`absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] transition-colors duration-500 
          ${isSyncing ? 'border-l-blue-600' : (hasRealNews ? 'border-l-red-600' : (syncError ? 'border-l-amber-600' : 'border-l-slate-800'))}`}>
        </div>
      </div>
      
      {/* Container de Scroll */}
      <div className="flex-grow relative h-full flex items-center">
        <div className="animate-ticker-infinite flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-white dark:text-gray-100 text-[10px] md:text-[11.5px] font-bold tracking-tight uppercase px-12">
                {text}
              </span>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <span className="text-blue-500 font-black text-[9px] px-8 tracking-tighter">WRF NEWS</span>
              <div className="h-4 w-[1px] bg-white/10"></div>
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
