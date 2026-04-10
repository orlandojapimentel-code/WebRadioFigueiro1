
import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "Amarante celebra as Festas de Junho com cartaz de luxo",
    excerpt: "As tradicionais festas da cidade prometem atrair milhares de visitantes com concertos e eventos culturais.",
    content: "A cidade de Amarante prepara-se para receber as Festas de Junho, um dos momentos mais altos do calendário cultural da região. Este ano, o cartaz conta com artistas de renome nacional e internacional, além das habituais celebrações religiosas e populares. A Web Rádio Figueiró estará presente para acompanhar todos os momentos em direto.",
    date: "15 Março, 2026",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  },
  {
    id: 2,
    title: "Novo espaço cultural inaugurado no centro histórico",
    excerpt: "Um antigo edifício foi recuperado para dar lugar a uma galeria de arte e espaço de coworking para artistas locais.",
    content: "O centro histórico de Amarante ganhou uma nova vida com a inauguração do Espaço Criativo. Este projeto de reabilitação urbana visa apoiar os talentos locais, oferecendo condições para a criação e exposição de obras de arte. O espaço inclui ainda uma zona de café e convívio aberta a toda a comunidade.",
    date: "12 Março, 2026",
    image: "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800"
  }
];

const NewsSection: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const handleCloseOverlays = () => setSelectedNews(null);
    window.addEventListener('close-overlays', handleCloseOverlays);

    if (selectedNews) {
      // Adicionar estado ao histórico para permitir retroceder
      window.history.pushState({ modal: 'news' }, '');
      
      const handlePopState = () => {
        setSelectedNews(null);
      };

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
      // Se o modal estiver aberto, retroceder no histórico se o estado for do modal
      if (window.history.state?.modal === 'news') {
        window.history.back();
      } else {
        setSelectedNews(null);
      }
    }
  };

  return (
    <section id="noticias" className="scroll-mt-48 space-y-8">
      <h3 className="text-3xl font-brand font-black tracking-tighter text-white">Últimas Notícias</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NEWS_DATA.map((news) => (
          <div 
            key={news.id} 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('close-overlays'));
              setSelectedNews(news);
            }}
            className="group bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <div className="h-48 overflow-hidden rounded-2xl mb-4">
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{news.date}</span>
            </div>
            <h4 className="text-xl font-black tracking-tight mb-2 text-white group-hover:text-red-500 transition-colors">{news.title}</h4>
            <p className="text-sm text-slate-400 line-clamp-2">{news.excerpt}</p>
          </div>
        ))}
      </div>

      {selectedNews && (
        <div 
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={closeNews}
        >
          <div 
            className="bg-slate-900 border border-white/10 rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-64 md:h-80">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              <button 
                onClick={closeNews}
                className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-8 md:p-12 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Notícia</span>
                <span className="text-slate-500 text-xs font-bold">{selectedNews.date}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-brand font-black text-white tracking-tighter leading-tight">{selectedNews.title}</h2>
              <div className="w-20 h-1 bg-red-600 rounded-full"></div>
              <p className="text-slate-300 text-lg leading-relaxed">{selectedNews.content}</p>
              
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Web Rádio Figueiró • Amarante</p>
                <button 
                  onClick={closeNews}
                  className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Fechar Notícia
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
