
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [newsText, setNewsText] = useState<string[]>([]);

  const loadTickerData = async () => {
    try {
      const result = await fetchLatestNews();
      
      // Divide por linhas e limpa agressivamente caracteres de formatação que a IA possa enviar
      const rawLines = result.text.split('\n');
      const items = rawLines
        .map(line => line.replace(/[*#`\d.\-]/g, '').trim())
        // Aceita títulos a partir de 15 caracteres para não perder notícias curtas de Amarante
        .filter(line => line.length > 15 && !line.toLowerCase().includes('http') && !line.toLowerCase().includes('clique') && !line.toLowerCase().includes('aqui estão') && !line.toLowerCase().includes('notícias de hoje'));
      
      if (items.length > 0) {
        setNewsText(items);
      } else {
        // Fallback dinâmico com mensagens da rádio caso a IA não retorne notícias limpas no momento
        setNewsText([
          "Web Rádio Figueiró: A Sintonizar as Melhores Notícias de Amarante e Região",
          "Música 24 Horas: A Sua Melhor Companhia Está Aqui na WRF Digital",
          "Destaque: Peça a sua música favorita através do nosso painel de pedidos",
          "Amarante em Foco: Acompanhe a nossa programação diária para estar sempre informado",
          "Web Rádio Figueiró: Elevando a Voz de Amarante para o Mundo Inteiro"
        ]);
      }
    } catch (error) {
      console.error("Erro no ticker:", error);
      // Fallback de erro silencioso e elegante
      setNewsText([
        "Web Rádio Figueiró: Sintonize a Excelência Sonora de Amarante",
        "Acompanhe as principais notícias da região na nossa emissão em direto"
      ]);
    }
  };

  useEffect(() => {
    loadTickerData();
    // Atualiza a cada 20 minutos para garantir notícias frescas
    const interval = setInterval(loadTickerData, 1200000); 
    return () => clearInterval(interval);
  }, []);

  // Multiplicamos os itens para garantir um fluxo contínuo sem espaços vazios
  const displayItems = newsText.length > 0 
    ? [...newsText, ...newsText, ...newsText]
    : ["A sintonizar as notícias de Amarante...", "Web Rádio Figueiró: A Sua Melhor Companhia...", "A sintonizar as notícias de Amarante..."];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/5 h-11 flex items-center overflow-hidden shadow-2xl">
      <div className="bg-red-600 h-full px-6 flex items-center z-20 shadow-[8px_0_20px_rgba(220,38,38,0.4)] relative shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse whitespace-nowrap">Última Hora</span>
        <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] border-l-red-600"></div>
      </div>
      
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
          animation: ticker-scroll-smooth 45s linear infinite;
        }
        .animate-ticker-smooth:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
