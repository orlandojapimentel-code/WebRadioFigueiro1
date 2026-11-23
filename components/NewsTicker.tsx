import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const FALLBACK_TICKER_PT = [
  'BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega',
  'Vindimas de Outono: Viticultores de Figueiró e Amarante celebram colheita de excelente qualidade',
  'Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades',
  'Web Rádio Figueiró: Nova programação de outono estreia com emissões dedicadas à diáspora',
  'Trilhos de Figueiró: Roteiro dos moinhos de água atrai caminhantes ao longo do Tâmega',
];

const FALLBACK_TICKER_EN = [
  "BECA Handball Debuts Senior Women's Team for the 2026/27 Season",
  'Autumn Harvest: Figueiró and Amarante Winegrowers Celebrate Outstanding Vinho Verde Quality',
  'Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together',
  'Web Rádio Figueiró: Autumn Broadcast Lineup Premieres Dedicated Diaspora Shows',
  'Figueiró Heritage Trails: Historic Watermills Welcome Walking Enthusiasts Along the Tâmega',
];

const NewsTicker: React.FC = () => {
  const { language, t } = useLanguage();

  const [newsText, setNewsText] = useState<string[]>(language === 'en' ? FALLBACK_TICKER_EN : FALLBACK_TICKER_PT);
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
          setNewsText(language === 'en' ? FALLBACK_TICKER_EN : FALLBACK_TICKER_PT);
          setDataSource('LOCAL');
        }
      }
    } catch {
      setNewsText(language === 'en' ? FALLBACK_TICKER_EN : FALLBACK_TICKER_PT);
      setDataSource('LOCAL');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, language]);

  useEffect(() => {
    setNewsText(language === 'en' ? FALLBACK_TICKER_EN : FALLBACK_TICKER_PT);
  }, [language]);

  useEffect(() => {
    const initialTimer = setTimeout(loadTickerData, 2000);
    const interval = setInterval(loadTickerData, 300000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [loadTickerData]);

  const scrollToNews = () => {
    const el = document.getElementById('noticias');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 112;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const displayItems = [...newsText, ...newsText, ...newsText];

  return (
    <div className="fixed top-14 sm:top-16 left-0 right-0 z-[150] bg-slate-100/95 dark:bg-[#0b0e17]/95 backdrop-blur-lg border-b border-slate-200 dark:border-white/[0.08] h-8 flex items-center overflow-hidden transition-colors">
      <button
        type="button"
        onClick={scrollToNews}
        className="h-full px-3 sm:px-5 flex items-center bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shrink-0 transition-colors"
      >
        {isSyncing ? t.ticker.syncing : dataSource === 'LIVE' ? t.ticker.liveLabel : t.ticker.localLabel}
      </button>

      <div className="flex-grow relative h-full flex items-center overflow-hidden">
        <button
          type="button"
          onClick={scrollToNews}
          className="animate-ticker-infinite flex whitespace-nowrap items-center text-left focus-visible:outline-none"
          aria-label={t.news.title}
        >
          {displayItems.map((text, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              <span className="text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-white text-xs font-medium px-6 transition-colors">
                {text}
              </span>
              <span className="text-red-600/60 dark:text-red-400/60 text-xs" aria-hidden="true">·</span>
            </span>
          ))}
        </button>
      </div>
    </div>
  );
};

export default NewsTicker;
