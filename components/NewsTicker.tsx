
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  // Notícias de reserva de alta qualidade (conteúdo institucional)
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
    
    // Timeout de 15s para garantir tempo suficiente para o Google Search
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 15000)
    );

    try {
      const result: any = await Promise.race([
        fetchLatestNews(),
        timeoutPromise
      ]);
      
      if (result && result.text) {
        // Remove introduções chatas da IA como "Aqui estão as notícias..."
        const cleanLines = result.text.split('\n')
          .filter((line: string) => {
            const l = line.toLowerCase();
            return !l.includes('aqui estão') && !l.includes('notícias de amarante') && !l.includes('recentes de amarante');
          });

        const items = cleanLines.map((line: string) => {
            // Remove APENAS números iniciais seguidos de ponto (ex: "1. ") ou traços/asteriscos
            // Mas PRESERVA números dentro do texto (ex: "S. Gonçalo 2025")
            return line.replace(/^[0-9\-\*\#\.\s]+/, '').replace(/[*#`]/g, '').trim();
          })
          .filter((title: string) => title.length > 8); // Filtro ligeiramente mais permissivo
        
        if (items.length > 0) {
          setNewsText(items);
        }
      }
    } catch (error) {
      console.warn("NewsTicker: Usando notícias locais (Offline ou Erro de API).");
      // Se falhar, mantém as de fallback ou as últimas que obteve
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadTickerData();
    // Atualiza a cada 10 minutos
    const interval = setInterval(loadTickerData, 600000);
    return () => clearInterval(interval);
  }, []);

  // Multiplicamos os itens para garantir o loop infinito suave
  const displayItems = [...newsText, ...newsText, ...newsText, ...newsText];

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
              <span className="text-blue-500 font-black text-[9px] px-8 tracking-tighter">WRF NEWS</span>
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
        .animate-ticker-continuous {
          display: inline-flex;
          animation: ticker-scroll 120s linear infinite;
        }
        .animate-ticker-continuous:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
