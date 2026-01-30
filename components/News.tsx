
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';

interface NewsItem {
  title: string;
  source: string;
  type: string;
  summary: string;
  url: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await fetchLatestNews();
      const newsBlocks = result.text.match(/NEWS_START[\s\S]*?NEWS_END/g);
      
      if (newsBlocks) {
        const parsed = newsBlocks.map(block => {
          const extract = (key: string) => {
            const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
            const match = block.match(regex);
            return match ? match[1].trim().replace(/[*`]/g, '') : "";
          };
          return {
            title: extract('TITULO'),
            source: extract('FONTE'),
            type: extract('TIPO'),
            summary: extract('RESUMO'),
            url: extract('LINK')
          };
        }).filter(item => item.title && item.url);
        setNews(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 3600000); // Atualiza de hora em hora
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl space-y-5 transition-all">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-600 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">Notícias</h4>
            <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tighter mt-1">Sintonizado no Mundo</p>
          </div>
        </div>
        {!loading && (
          <button onClick={loadNews} className="text-gray-400 hover:text-blue-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full w-24"></div>
              <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-3/4"></div>
            </div>
          ))
        ) : news.length > 0 ? (
          news.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${item.type === 'LOCAL' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {item.type}
                </span>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter truncate max-w-[100px]">
                  {item.source}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                {item.title}
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 line-clamp-1 italic">
                {item.summary}
              </p>
              <div className="h-[1px] bg-gray-100 dark:bg-white/5 mt-4 group-last:hidden"></div>
            </a>
          ))
        ) : (
          <p className="text-center text-[10px] text-gray-500 py-4 uppercase font-bold tracking-widest">A aguardar sinal informativo...</p>
        )}
      </div>

      <a 
        href="https://news.google.com/search?q=Amarante" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full py-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-center text-slate-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 transition-all"
      >
        Mais Notícias no Google
      </a>
    </div>
  );
};

export default News;
