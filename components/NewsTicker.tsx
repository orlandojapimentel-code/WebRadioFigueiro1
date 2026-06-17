
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const FALLBACK_TICKER_PT = [
  "Web Rádio Figueiró: Lançada aplicação oficial com emissão em Alta Definição (HD) e assistente IA",
  "Cultura em Época: Encontro Regional de Concertinas encheu de ritmo e cor o coração de Figueiró",
  "Natureza em Amarante: Novo trilho 'Caminhos de São Gonçalo' atrai pedestrianistas a Figueiró",
  "Gastronomia Tradicional: Feira de Artesanato de Amarante destaca doces conventuais e vinhos verdes",
  "Música no Rio: Concertos de verão no Parque Ribeirinho continuam a atrair milhares de visitantes"
];

const FALLBACK_TICKER_EN = [
  "Web Rádio Figueiró: Official app launched with High Definition (HD) broadcasting and AI assistant",
  "Seasonal Culture: Regional Concertina Meeting filled the heart of Figueiró with traditional rhythms",
  "Nature in Amarante: New scenic trail 'Caminhos de São Gonçalo' attracts hikers to Figueiró",
  "Traditional Gastronomy: Amarante Crafts Fair highlights conventual sweets and local green wines",
  "Music by the River: Summer concerts in Ribeirinho park continue to attract thousands of visitors"
];

const NewsTicker: React.FC = () => {
  const { language } = useLanguage();

  const [newsText, setNewsText] = useState<string[]>(language === 'pt' ? FALLBACK_TICKER_PT : FALLBACK_TICKER_EN);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataSource, setDataSource] = useState<'LIVE' | 'LOCAL' | 'NONE'>('NONE');
  
  const loadTickerData = React.useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      const result = await fetchLatestNews(language);
      
      if (result && result.text) {
        const rawItems = result.text.split('\n');
        const items = rawItems
          .map((line: string) => line.replace(/^[0-9\-*#.\s•]+/, '').replace(/[*#`_]/g, '').trim())
          .filter((title: string) => title.length > 5); 
        
        if (items.length >= 1) {
          setNewsText(items.slice(0, 8));
          setDataSource((result.source as 'LIVE' | 'LOCAL' | 'NONE') || 'LOCAL');
        } else {
          setNewsText(language === 'pt' ? FALLBACK_TICKER_PT : FALLBACK_TICKER_EN);
          setDataSource('LOCAL');
        }
      }
    } catch {
      console.warn("Ticker: Mantendo dados locais devido a falha externa.");
      setNewsText(language === 'pt' ? FALLBACK_TICKER_PT : FALLBACK_TICKER_EN);
      setDataSource('LOCAL');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, language]);

  useEffect(() => {
    setNewsText(language === 'pt' ? FALLBACK_TICKER_PT : FALLBACK_TICKER_EN);
  }, [language]);

  useEffect(() => {
    const initialTimer = setTimeout(loadTickerData, 3000);
    const interval = setInterval(loadTickerData, 300000); // 5 minutes refresh
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [loadTickerData]);

  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-20 left-0 right-0 z-[45] bg-black border-b border-red-600/20 h-11 flex items-center overflow-hidden shadow-xl">
      <div className={`h-full px-6 flex items-center z-20 shadow-[10px_0_25px_rgba(0,0,0,0.5)] relative shrink-0 transition-all duration-700 
        ${isSyncing ? 'bg-blue-600' : (dataSource === 'LIVE' ? 'bg-red-600' : 'bg-red-600')}`}>
        
        <div className="text-[10px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center">
          {isSyncing ? (
            <span className="animate-pulse">Sincronizando...</span>
          ) : (
            <>
              <div className={`w-2 h-2 rounded-full mr-2 ${dataSource === 'LIVE' ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
              <span>{dataSource === 'LIVE' ? 'Direto Amarante' : 'WRF News'}</span>
            </>
          )}
        </div>
        
        <div className={`absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[12px] transition-colors duration-500 
          ${isSyncing ? 'border-l-blue-600' : (dataSource === 'LIVE' ? 'border-l-red-600' : 'border-l-red-600')}`}>
        </div>
      </div>
      
      <div className="flex-grow relative h-full flex items-center bg-black">
        <div className="animate-ticker-infinite flex whitespace-nowrap items-center">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-white text-[10px] md:text-[11px] font-bold tracking-tight uppercase px-12">
                {text}
              </span>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <span className="text-red-500 font-black text-[9px] px-8 tracking-tighter">WRF NEWS</span>
              <div className="h-4 w-[1px] bg-white/10"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
