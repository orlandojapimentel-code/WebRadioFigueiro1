
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  // Notícias de reserva de alta qualidade (sempre visíveis até a IA responder)
  const FALLBACK_TICKER = [
    "Web Rádio Figueiró: A sua melhor companhia em Amarante e no Mundo",
    "Sintonize a excelência sonora com a WRF Digital - Emissão 24 horas por dia",
    "Peça a sua música favorita através do nosso WhatsApp: +351 910 270 085",
    "WRF: Elevando a voz de Amarante para todos os corações através da música",
    "Cultura e Informação: Acompanhe as novidades da nossa região aqui na Figueiró"
  ];

  const [newsText, setNewsText] = useState<string[]>(FALLBACK_TICKER);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadTickerData = async () => {
    setIsSyncing(true);
    
    // Timeout de 10s para não prender o estado "Sintonizar" caso a API demore
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 10000)
    );

    try {
      const result: any = await Promise.race([
        fetchLatestNews(),
        timeoutPromise
      ]);
      
      if (result && result.text) {
        const items = result.text.split('\n')
          .map((line: string) => {
            // Limpeza profunda de caracteres de listas (1., -, *, #)
            return line.replace(/^[0-9\-\*\#\.\s]+/, '').replace(/[*#`]/g, '').trim();
          })
          .filter((title: string) => title.length > 10);
        
        if (items.length > 0) {
          setNewsText(items);
        }
      }
    } catch (error) {
      console.warn("NewsTicker: Usando notícias locais da rádio (Offline/API Busy).");
      // Mantém o estado anterior ou FALLBACK_TICKER
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Tenta carregar notícias reais logo ao início
    loadTickerData();
    
    // Atualiza a cada 15 minutos
    const interval = setInterval(loadTickerData, 900000);
    return () => clearInterval(interval);
  }, []);

  // Triplicamos os itens para garantir que o scroll infinito não tenha falhas visuais
  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      {/* Indicador Vermelho "Última Hora" */}
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[10px_0_20px_rgba(220,38,38,0.3)] relative shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center space-x-2">
          {isSyncing && (
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          )}
          <span>{isSyncing ? 'Sintonizar' : 'Última Hora'}</span>
        </span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
      {/* Área de Texto com Scroll Infinito */}
      <div className="flex-grow relative overflow-hidden h-full flex items-center">
        <div className="animate-ticker-continuous flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center shrink-0">
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
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-ticker-continuous {
          display: inline-flex;
          animation: ticker-scroll 80s linear infinite;
        }
        .animate-ticker-continuous:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
