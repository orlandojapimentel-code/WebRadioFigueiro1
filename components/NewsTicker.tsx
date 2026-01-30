
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [newsText, setNewsText] = useState<string[]>([]);

  const loadTickerData = async () => {
    try {
      const result = await fetchLatestNews();
      
      // Nova lógica de extração ultra-resiliente
      // Remove caracteres especiais de markdown e numerações que a IA às vezes envia
      const rawLines = result.text.split('\n');
      const items = rawLines
        .map(line => line.replace(/[*#`\d.]/g, '').trim())
        .filter(line => line.length > 30 && !line.toLowerCase().includes('http') && !line.toLowerCase().includes('clique') && !line.toLowerCase().includes('link'));
      
      if (items.length > 0) {
        setNewsText(items);
      } else {
        // Fallbacks informativos sobre a rádio se a busca não retornar notícias limpas
        setNewsText([
          "Web Rádio Figueiró: A Sintonizar as Melhores Notícias de Amarante e Região",
          "Música 24 Horas por Dia: A Sua Melhor Companhia Está Aqui na WRF Digital",
          "Destaque: Peça a sua música favorita através do nosso novo painel de pedidos",
          "Cultura e Informação: Siga a nossa agenda cultural e não perca nenhum evento em Amarante",
          "Web Rádio Figueiró: Elevando a Voz de Amarante para o Mundo Inteiro"
        ]);
      }
    } catch (error) {
      console.error("Erro no ticker:", error);
      setNewsText(["Web Rádio Figueiró: A Sintonizar as Principais Notícias de Amarante..."]);
    }
  };

  useEffect(() => {
    loadTickerData();
    const interval = setInterval(loadTickerData, 900000); // Atualiza a cada 15 min para manter frescura
    return () => clearInterval(interval);
  }, []);

  // Multiplicamos os itens para garantir um fluxo contínuo sem espaços vazios na animação
  const displayItems = newsText.length > 0 
    ? [...newsText, ...newsText, ...newsText]
    : ["A sintonizar as notícias de Amarante...", "Web Rádio Figueiró: A Sua Melhor Companhia...", "A sintonizar as notícias de Amarante..."];

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
          animation: ticker-scroll-fast 35s linear infinite;
        }
        .animate-ticker-fast:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
