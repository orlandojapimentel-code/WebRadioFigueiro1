
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const FALLBACK_TICKER_PT = [
  "BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega",
  "Vindimas de Outono: Viticultores de Figueiró e Amarante celebram colheita de excelente qualidade",
  "Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades de Amarante",
  "Web Rádio Figueiró: Nova programação de outono estreia com emissões dedicadas à diáspora",
  "Trilhos de Figueiró: Roteiro dos moinhos de água atrai caminhantes e amantes de natureza no Tâmega"
];

const FALLBACK_TICKER_EN = [
  "BECA Handball Debuts Senior Women's Team for the 2026/27 Season",
  "Autumn Harvest: Figueiró and Amarante Winegrowers Celebrate Outstanding Vinho Verde Quality",
  "Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together",
  "Web Rádio Figueiró: Autumn Broadcast Lineup Premieres Dedicated Diaspora Shows",
  "Figueiró Heritage Trails: Historic Watermills Welcome Walking Enthusiasts Along the Tâmega"
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
    <div className="fixed top-20 sm:top-24 left-0 right-0 z-[45] bg-[#07090e]/95 backdrop-blur-xl border-b border-white/[0.08] h-10 flex items-center overflow-hidden shadow-lg transition-all">
      <div className={`h-full px-4 sm:px-6 flex items-center z-20 shadow-[6px_0_20px_rgba(0,0,0,0.6)] relative shrink-0 transition-all duration-500 
        ${isSyncing ? 'bg-blue-600' : 'bg-gradient-to-r from-red-600 to-rose-600'}`}>
        
        <div className="text-[10px] font-black text-white uppercase tracking-[0.25em] whitespace-nowrap flex items-center space-x-2">
          {isSyncing ? (
            <span className="animate-pulse flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>Sincronizando...</span>
            </span>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{dataSource === 'LIVE' ? 'Amarante Hoje' : 'WRF News'}</span>
            </>
          )}
        </div>
        
        <div className={`absolute -right-3 top-0 bottom-0 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[12px] transition-colors duration-500 
          ${isSyncing ? 'border-l-blue-600' : 'border-l-rose-600'}`}>
        </div>
      </div>
      
      <div className="flex-grow relative h-full flex items-center overflow-hidden group">
        <div className="animate-ticker-infinite group-hover:[animation-play-state:paused] flex whitespace-nowrap items-center cursor-pointer">
          {displayItems.map((text, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-slate-200 hover:text-white text-[11px] font-semibold tracking-tight px-8 transition-colors">
                {text}
              </span>
              <span className="text-red-500/80 font-black text-[9px] px-3 tracking-wider flex items-center space-x-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                <span>WRF</span>
              </span>
              <div className="h-3 w-[1px] bg-white/10"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
