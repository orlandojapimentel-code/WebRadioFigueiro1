
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
  url?: string;
  source?: string;
}

const FALLBACK_NEWS_PT: NewsItem[] = [
  {
    id: "f1",
    title: "BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega",
    excerpt: "O clube da região do Tâmega assinala um momento histórico no andebol, reforçando o desporto feminino e a formação jovem.",
    content: "A comunidade desportiva de Amarante e da região do Baixo Tâmega celebra a estreia oficial da equipa sénior feminina do BECA (Bastinhos Escola Clube de Andebol) para a temporada 2026/27.\n\nDirigentes e atletas sublinharam o entusiasmo em representar as cores da nossa terra nas competições oficiais, com forte apoio das famílias e adeptos locais.\n\nA Web Rádio Figueiró acompanhará a evolução dos resultados e o calendário dos jogos nas nossas emissões desportivas.",
    date: "Hoje",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
    url: "https://tamega.tv/2026/10/06/beca-estreia-equipa-senior-feminina-na-epoca-2026-27/",
    source: "TÂMEGA.TV"
  },
  {
    id: "f2",
    title: "Outono em Figueiró: Vindimas concluídas com Vinho Verde de excelente qualidade",
    excerpt: "Viticultores e quintas de Figueiró e Amarante celebram uma colheita com perfeito equilíbrio de aromas e frescura nas encostas do Tâmega.",
    content: "As quintas e vinhedos da freguesia de Figueiró e do vale do Tâmega concluíram com sucesso a tradicional faina das vindimas de outono. Favorecidas por semanas de sol ameno e noites frescas, as castas regionais como Azal, Avesso e Pedernã apresentaram uma maturação ímpar.\n\nA colheita reuniu famílias locais e emigrantes da diáspora que prolongaram a estadia na terra natal para participar na pisa e no convívio tradicional nas adegas.\n\nOs produtores antecipam que os vinhos da colheita de 2026 irão destacar-se pela vivacidade e autenticidade do nosso terroir.",
    date: "Ontem",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800",
    url: "https://www.cm-amarante.pt",
    source: "Município Amarante"
  },
  {
    id: "f3",
    title: "Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades",
    excerpt: "Eventos culturais e mostras artísticas dinamizam Amarante e o Tâmega com iniciativas dedicadas aos jovens e ao património local.",
    content: "A programação cultural de outono na região do Tâmega arrancou com iniciativas que combinam sessões de cinema, encontros com autores e espetáculos musicais ao ar livre.\n\nEspaços históricos de Amarante e das freguesias vizinhas abrem as portas a visitas guiadas e tertúlias sobre as tradições orais e o património construído.\n\nA Web Rádio Figueiró continua a divulgar a agenda dos eventos para que nenhum ouvinte perca os principais destaques da nossa terra.",
    date: "04 de Outubro, 2026",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800",
    url: "https://tamega.tv",
    source: "TÂMEGA.TV"
  },
  {
    id: "f4",
    title: "Web Rádio Figueiró reforça programação de outono com emissões dedicadas à diáspora",
    excerpt: "A rádio lança novas rubricas e ligações em direto com emigrantes de Amarante espalhados pela Europa e pelo mundo.",
    content: "Com a chegada do mês de outubro, a Web Rádio Figueiró intensifica a sua grelha com programas especiais que unem as famílias de Figueiró aos conterrâneos residentes em França, Suíça, Alemanha e nas Américas.\n\nAs novas emissões incluem dedicatórias em tempo real, partilha de memórias e os maiores êxitos da música portuguesa e popular.\n\nA direção da rádio agradece a fidelidade de todos os ouvintes que sintonizam a nossa emissão em Alta Definição.",
    date: "02 de Outubro, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800",
    url: "https://www.webradiofigueiro.pt",
    source: "Web Rádio Figueiró"
  }
];

const FALLBACK_NEWS_EN: NewsItem[] = [
  {
    id: "f1",
    title: "BECA Handball Debuts Senior Women's Team for the 2026/27 Season",
    excerpt: "The sports club based in the Tâmega region launches a major milestone promoting women's sports across municipal parishes.",
    content: "The sports community across Amarante and Baixo Tâmega celebrates the debut of the senior women's handball team by BECA (Bastinhos Escola Clube de Andebol) for the official 2026/27 season.\n\nLocal sporting officials highlighted the enthusiasm and dedication of the young athletes representing regional colors on the national stage.\n\nWeb Rádio Figueiró will follow the team's upcoming matches and scores with weekly broadcasts dedicated to regional sports.",
    date: "Today",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
    url: "https://tamega.tv/2026/10/06/beca-estreia-equipa-senior-feminina-na-epoca-2026-27/",
    source: "TÂMEGA.TV"
  },
  {
    id: "f2",
    title: "Autumn Along the Tâmega: Grape Harvest Completed with Outstanding Vinho Verde Quality",
    excerpt: "Wine estates and local growers in Figueiró and Amarante celebrate exceptional acidity and aroma balance in this year's harvest.",
    content: "Vineyards across the parish of Figueiró and the Tâmega valley have concluded the traditional grape harvest. Supported by sunny autumn afternoons and cool nights, native grape varieties such as Azal, Avesso, and Pedernã reached optimal balance.\n\nLocal families and diaspora visitors joined in the time-honored tradition of manual harvesting, bringing vibrant community spirit to wine cellars.\n\nWinemakers anticipate that the 2026 vintage will stand out for its freshness and distinct regional terroir.",
    date: "Yesterday",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800",
    url: "https://www.cm-amarante.pt",
    source: "Município Amarante"
  },
  {
    id: "f3",
    title: "Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together",
    excerpt: "Cultural initiatives, exhibitions, and musical gatherings honor Portuguese cinema and arts in Amarante and Baião.",
    content: "The autumn cultural calendar has begun across the Tâmega region, uniting local schools, artists, and families around open-air exhibitions, author talks, and music performances.\n\nHistorical spaces along the Tâmega River and community centers host sessions celebrating Portuguese literature and classic cinema.\n\nWeb Rádio Figueiró invites listeners across the globe to tune into daily cultural previews and event highlights.",
    date: "October 04, 2026",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800",
    url: "https://tamega.tv",
    source: "TÂMEGA.TV"
  },
  {
    id: "f4",
    title: "Web Rádio Figueiró Expands Autumn Live Shows for the Portuguese Diaspora",
    excerpt: "The radio station refreshes its broadcast schedule with new community shows and enhanced regional coverage.",
    content: "Web Rádio Figueiró has launched an updated autumn programming schedule, strengthening bonds between residents in Amarante and thousands of Portuguese emigrants in France, Switzerland, Germany, and the Americas.\n\nNew interactive segments allow listeners to send live audio messages, share family memories, and request timeless regional classics.\n\nThe station's management expresses sincere gratitude to all listeners tuned into our crystal-clear HD broadcast worldwide.",
    date: "October 02, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800",
    url: "https://www.webradiofigueiro.pt",
    source: "Web Rádio Figueiró"
  }
];

const CATEGORIES = [
  {
    name: 'gastronomia',
    keywords: [
      'gastronomia', 'artesanato', 'doce', 'conventual', 'vinho', 'verde', 
      'feira', 'mercado', 'sabor', 'sabores', 'comida', 'prato', 'receita', 
      'gastronomy', 'wine', 'sweets', 'feiras', 'exposição', 'azeite', 'queijo', 
      'presunto', 'broa', 'enogastronomia'
    ],
    images: [
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800",
      "https://images.unsplash.com/photo-149514740007a-f8a53e36824b?q=80&w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800"
    ]
  },
  {
    name: 'musica',
    keywords: [
      'concertina', 'concerto', 'música', 'music', 'instrumento', 'festival', 
      'espetáculo', 'show', 'banda', 'rancho', 'folclore', 'romaria', 'festa', 
      'cantares', 'guitarra', 'canção', 'canções', 'espetáculos', 'concertos',
      'festejos', 'popular', 'populares', 'grupo'
    ],
    images: [
      "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800",
      "https://images.unsplash.com/photo-1555412654-e2245e434435?q=80&w=800",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800"
    ]
  },
  {
    name: 'natureza',
    keywords: [
      'trilho', 'caminho', 'pedestre', 'natureza', 'rio', 'tâmega', 'ponte', 
      'floresta', 'serra', 'marão', 'parque', 'turismo', 'scenic', 'trail', 
      'hiking', 'nature', 'river', 'bridge', 'forest', 'caminhos', 'paisagem',
      'árvores', 'sinalizado', 'sinalizada', 'percurso'
    ],
    images: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800"
    ]
  },
  {
    name: 'desporto',
    keywords: [
      'desporto', 'corrida', 'maratona', 'ciclismo', 'bicicleta', 'futebol', 
      'atleta', 'torneio', 'campeonato', 'clube', 'sports', 'running', 'cycling',
      'estádio', 'jogo', 'atletismo', 'ciclista', 'trail-run'
    ],
    images: [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800",
      "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=800",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800"
    ]
  },
  {
    name: 'literatura',
    keywords: [
      'livro', 'biblioteca', 'literário', 'poesia', 'escritor', 'leitura', 
      'literatura', 'pascoaes', 'agustina', 'editor', 'romance', 'book', 'library', 'literary'
    ],
    images: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800"
    ]
  },
  {
    name: 'comunidade',
    keywords: [
      'câmara', 'município', 'presidente', 'autarquia', 'vereador', 'decisão', 
      'política', 'obras', 'reunião', 'assembleia', 'mayor', 'municipality', 
      'city hall', 'council', 'solidariedade', 'bombeiros', 'saúde', 'hospital', 
      'social', 'apoio', 'ajuda', 'comunidade', 'paróquia', 'centro social', 'creche'
    ],
    images: [
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800",
      "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800"
    ]
  },
  {
    name: 'radio',
    keywords: [
      'empresa', 'comércio', 'economia', 'tecnologia', 'aplicação', 'app', 
      'digital', 'inovação', 'ia', 'inteligência artificial', 'rádio', 'radio', 
      'emissão', 'estúdio', 'microfone', 'broadcasting', 'sintonizar', 'comunicação', 
      'ouvintes', 'freguesia', 'podcast', 'locutor', 'antena', 'frequência', 'wrf'
    ],
    images: [
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
    ]
  }
];

const getHashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getNewsImage = (title: string, content: string, rawImage?: string): string => {
  const cleanImg = rawImage ? rawImage.trim() : "";
  const isBlockedDomain = cleanImg.includes('jn.pt') || cleanImg.includes('publico.pt') || 
                          cleanImg.includes('sapo.pt') || cleanImg.includes('tvi') || 
                          cleanImg.includes('rtp') || cleanImg.includes('sic') ||
                          cleanImg.includes('cmjornal') || cleanImg.includes('observador') ||
                          cleanImg.includes('renascenca') || cleanImg.includes('rr.sapo.pt') ||
                          cleanImg.includes('e-cultura') || cleanImg.includes('porto');

  if (cleanImg && (cleanImg.startsWith('http://') || cleanImg.startsWith('https://')) && 
      !cleanImg.includes('placeholder') && !cleanImg.includes('error') && !isBlockedDomain) {
    return cleanImg;
  }

  let bestCategory = CATEGORIES[CATEGORIES.length - 1]; // defaults to 'radio'
  let maxScore = -1;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (title.toLowerCase().includes(kw)) {
        score += 4; // High weight for title match
      }
      if (content.toLowerCase().includes(kw)) {
        score += 1; // Standard weight for content match
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  const hash = getHashCode(title);
  const imgList = bestCategory.images;
  return imgList[hash % imgList.length];
};

const NewsSection: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { language } = useLanguage();
  const [newsList, setNewsList] = useState<NewsItem[]>(language === 'pt' ? FALLBACK_NEWS_PT : FALLBACK_NEWS_EN);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result: any = await fetchDetailedNews(language);
      if (result && result.items && Array.isArray(result.items) && result.items.length > 0) {
        setNewsList(result.items);
        return;
      }
      if (result && result.text) {
        const newsBlocks = result.text.match(/NOTICIA_START[\s\S]*?NOTICIA_END/g);
        if (newsBlocks && newsBlocks.length > 0) {
          const parsed = newsBlocks.map((block: string, idx: number) => {
            const extract = (key: string) => {
              const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
              const match = block.match(regex);
              return match ? match[1].trim().replace(/[*`]/g, '') : "";
            };

            const title = extract('TITULO') || "Novidade Web Rádio Figueiró";
            const date = extract('DATA') || "Hoje";
            const excerpt = extract('RESUMO');
            const content = extract('CONTEUDO');
            const rawImage = extract('IMAGEM');

            return {
              id: `news-${idx}`,
              title,
              date,
              excerpt,
              content,
              image: getNewsImage(title, content, rawImage)
            };
          });
          setNewsList(parsed);
          return;
        }
      }
      // If result.text doesn't contain elements or fails, use fallback list
      setNewsList(language === 'pt' ? FALLBACK_NEWS_PT : FALLBACK_NEWS_EN);
    } catch (error) {
      console.warn("Notice loading news in component:", error);
      setNewsList(language === 'pt' ? FALLBACK_NEWS_PT : FALLBACK_NEWS_EN);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 15 * 60 * 1000); // 15 mins
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadNews();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
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
    <section id="noticias" className="scroll-mt-48 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">
              Jornalismo Regional
            </span>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Em Direto • Atualizado Automaticamente</span>
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-brand font-black tracking-tight text-white mt-1">
            {language === 'pt' ? 'Últimas Notícias da Região' : 'Latest Regional News'}
          </h3>
        </div>
        <button 
          onClick={loadNews}
          className="self-start sm:self-auto p-3 sm:px-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group flex items-center space-x-2 shadow-sm"
          title={language === 'pt' ? "Atualizar Notícias" : "Refresh News"}
        >
          <svg className={`w-4 h-4 text-slate-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {loading ? (language === 'pt' ? 'A carregar...' : 'Loading...') : (language === 'pt' ? 'Atualizar Notícias' : 'Refresh News')}
          </span>
        </button>
      </div>

      {loading && newsList.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="glass-card h-72 animate-pulse overflow-hidden"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {newsList.map((news) => (
            <div 
              key={news.id} 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('close-overlays'));
                setSelectedNews(news);
              }}
              className="group glass-card glass-card-interactive cursor-pointer flex flex-col h-full overflow-hidden"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-5 sm:left-6 flex flex-wrap items-center gap-2">
                   <span className="px-3 py-1 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md border border-red-400/30">
                     {news.date}
                   </span>
                   {news.source && (
                     <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-slate-200 text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-md border border-white/15">
                       {news.source}
                     </span>
                   )}
                </div>
              </div>
              
              <div className="p-6 sm:p-7 flex flex-col flex-grow">
                <h4 className="text-lg sm:text-xl font-brand font-black tracking-tight mb-3 text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                  {news.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6 flex-grow font-normal">
                  {news.excerpt}
                </p>
                <div className="flex items-center text-[10px] font-black text-red-500 uppercase tracking-widest group-hover:translate-x-1.5 transition-transform">
                  <span>{language === 'pt' ? 'Ler Notícia Completa' : 'Read Full Article'}</span>
                  <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNews && (
        <div 
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={closeNews}
        >
          <div 
            className="bg-[#0b0e17] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 right-0 p-4 sm:p-6 flex justify-end z-20 pointer-events-none">
              <button 
                onClick={closeNews}
                className="pointer-events-auto p-3 sm:p-3.5 bg-black/70 hover:bg-red-600 text-white rounded-2xl backdrop-blur-md transition-all shadow-xl border border-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-6 sm:px-12 pb-12 space-y-8 -mt-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  </div>
                  <span className="text-red-500 text-xs font-black uppercase tracking-widest">{selectedNews.date}</span>
                  {selectedNews.source && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300 border border-white/10">
                      {selectedNews.source}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-brand font-black text-white tracking-tighter leading-tight">{selectedNews.title}</h2>
              </div>

              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 h-64 md:h-[400px]">
                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-invert max-w-none">
                 <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-line">
                   {selectedNews.content}
                 </p>
              </div>
              
              <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 p-2 flex items-center justify-center">
                    <span className="text-white font-black text-xs">WRF</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{selectedNews.source ? `Fonte: ${selectedNews.source}` : 'Redação WRF'}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Web Rádio Figueiró Amarante</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {selectedNews.url && (
                    <a
                      href={selectedNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
                    >
                      <span>{language === 'pt' ? 'Ler no portal de origem' : 'Read original source'}</span>
                      <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                  <button 
                    onClick={closeNews}
                    className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                  >
                    {language === 'pt' ? 'Regressar ao Início' : 'Back to Home'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
