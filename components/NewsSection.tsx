
import React, { useState, useEffect } from 'react';
import { fetchDetailedNews } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "f1",
    title: "Amarante celebra as Festas de Junho com cartaz de luxo",
    excerpt: "As tradicionais festas da cidade prometem atrair milhares de visitantes com concertos.",
    content: "A cidade de Amarante prepara-se para receber as Festas de Junho, um dos momentos mais altos do calendário cultural da região.",
    date: "15 Maio, 2026",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  }
];

const NewsSection: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await fetchDetailedNews(language);
      if (result && result.text) {
        const newsBlocks = result.text.match(/NOTICIA_START[\s\S]*?NOTICIA_END/g);
        if (newsBlocks && newsBlocks.length > 0) {
          const parsed = newsBlocks.map((block, idx) => {
            const extract = (key: string) => {
              const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
              const match = block.match(regex);
              return match ? match[1].trim().replace(/[*`]/g, '') : "";
            };

            return {
              id: `news-${idx}`,
              title: extract('TITULO') || "Novidade Web Rádio Figueiró",
              date: extract('DATA') || "Hoje",
              excerpt: extract('RESUMO'),
              content: extract('CONTEUDO'),
              image: extract('IMAGEM') || "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800"
            };
          });
          setNewsList(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading news in component:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const handleCloseOverlays = () => setSelectedNews(null);
    window.addEventListener('close-overlays', handleCloseOverlays);

    if (selectedNews) {
      window.history.pushState({ modal: 'news' }, '');
      const handlePopState = () => setSelectedNews(null);
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('close-overlays', handleCloseOverlays);
      };
    }

    return () => window.removeEventListener('close-overlays', handleCloseOverlays);
  }, [selectedNews]);

  const closeNews = () => {
    if (selectedNews) {
      if (window.history.state?.modal === 'news') {
        window.history.back();
      } else {
        setSelectedNews(null);
      }
    }
  };

  return (
    <section id="noticias" className="scroll-mt-48 space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl md:text-4xl font-brand font-black tracking-tighter text-white">Últimas Notícias</h3>
        <button 
          onClick={loadNews}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
          title="Atualizar Notícias"
        >
          <svg className={`w-5 h-5 text-slate-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {loading && newsList.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="bg-white/5 h-64 rounded-3xl animate-pulse overflow-hidden border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {newsList.map((news) => (
            <div 
              key={news.id} 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('close-overlays'));
                setSelectedNews(news);
              }}
              className="group bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 hover:border-red-600/30 transition-all cursor-pointer hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden rounded-t-[2.5rem]">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-8">
                   <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                     {news.date}
                   </span>
                </div>
              </div>
              
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <h4 className="text-xl md:text-2xl font-black tracking-tighter mb-4 text-white group-hover:text-red-500 transition-colors line-clamp-2">
                  {news.title}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-8 flex-grow">
                  {news.excerpt}
                </p>
                <div className="flex items-center text-[10px] font-black text-red-600 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Ler Notícia Completa
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNews && (
        <div 
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={closeNews}
        >
          <div 
            className="bg-[#0a0a0f] border border-white/10 rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 right-0 p-6 flex justify-end z-20 pointer-events-none">
              <button 
                onClick={closeNews}
                className="pointer-events-auto p-4 bg-white/10 hover:bg-red-600 text-white rounded-2xl backdrop-blur-md transition-all shadow-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-8 md:px-16 pb-16 space-y-10 -mt-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  </div>
                  <span className="text-red-500 text-xs font-black uppercase tracking-widest">{selectedNews.date}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-brand font-black text-white tracking-tighter leading-tight">{selectedNews.title}</h2>
              </div>

              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 h-64 md:h-[400px]">
                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-invert max-w-none">
                 <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
                   {selectedNews.content}
                 </p>
              </div>
              
              <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 p-2 flex items-center justify-center">
                    <span className="text-white font-black text-xs">WRF</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">Redação WRF</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Web Rádio Figueiró Amarante</p>
                  </div>
                </div>
                <button 
                  onClick={closeNews}
                  className="w-full md:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                >
                  Regressar ao Início
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
