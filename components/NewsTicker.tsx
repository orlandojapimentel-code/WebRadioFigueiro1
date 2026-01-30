
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const FALLBACK_TICKER = [
    "Web Rádio Figueiró: A sua melhor companhia em Amarante e no Mundo",
    "Sintonize a excelência sonora com a WRF Digital - Emissão 24 horas por dia",
    "Peça a sua música favorita através do nosso painel de pedidos via WhatsApp",
    "WRF: Elevando a voz de Amarante para todos os corações através da música",
    "Cultura e Informação: Acompanhe as novidades da nossa região aqui na Figueiró"
  ];

  const [newsText, setNewsText] = useState<string[]>(FALLBACK_TICKER);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadTickerData = async () => {
    setIsSyncing(true);
    
    // Timeout de segurança para não deixar o badge de "Sintonizar" ativo para sempre
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 8000)
    );

    try {
      const result: any = await Promise.race([
        fetchLatestNews(),
        timeoutPromise
      ]);
      
      if (result && result.text) {
        const items = result.text.split('\n')
          .map((line: string) => line.replace(/[*#`\d.\-]/g, '').trim())
          .filter((title: string) => title.length > 15);
        
        if (items.length > 0) {
          setNewsText(items);
        }
      }
    } catch (error) {
      console.warn("NewsTicker: Usando notícias de reserva (API indisponível).");
      // Mantemos o FALLBACK_TICKER que já está no estado
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Tenta atualizar as notícias reais logo após carregar a página
    const initialTimer = setTimeout(loadTickerData, 1500);
    
    const interval = setInterval(loadTickerData, 900000); // 15 min
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Triplicamos para garantir um scroll contínuo e fluido
  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      {/* Indicador Vermelho */}
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[8px_0_20px_rgba(220,38,38,0.4)] relative shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap">
          {isSyncing ? (
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              <span>Sintonizar</span>
            </span>
          ) : 'Última Hora'}
        </span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
      {/* Conteúdo Animado */}
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
          animation: ticker-scroll-smooth 65s linear infinite;
        }
        @media (hover: hover) {
          .animate-ticker-smooth:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
