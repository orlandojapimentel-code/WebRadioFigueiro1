
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

const FALLBACK_NEWS_PT: NewsItem[] = [
  {
    id: "f1",
    title: "Vindimas em Amarante e Figueiró Anteveem Vinho Verde de Excelente Qualidade",
    excerpt: "A época das vindimas arrancou em força nas encostas do Tâmega e socalcos de Figueiró, com viticultores a prever colheita excecional.",
    content: "As quintas e vinhedos da sub-região de Amarante e da freguesia de Figueiró iniciaram a tradicional azáfama das vindimas de outono. Favorecidas por um verão de noites frescas e dias de sol ameno, as castas autóctones como Azal, Avesso e Pedernã apresentam uma maturação perfeita e equilíbrio de acidez ímpar.\n\nNa freguesia de Figueiró, pequenos e médios produtores preservam a colheita manual e a pisa tradicional em lagares de granito. A época traz também de volta o convívio nas adegas, juntando vizinhos e familiares da diáspora que prolongaram a estadia para participar nesta tradição secular.\n\nA Web Rádio Figueiró acompanhará ao longo de setembro as histórias dos nossos viticultores, com transmissões dedicadas aos aromas e saberes do nosso Vinho Verde.",
    date: "16 Setembro, 2026",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800"
  },
  {
    id: "f2",
    title: "Amarante Celebra Jornadas Europeias do Património com Roteiros e Música no Tâmega",
    excerpt: "Monumentos históricos, pontes seculares e trilhos naturais de Figueiró abrem portas com visitas guiadas e concertos gratuitos no final de setembro.",
    content: "De 25 a 27 de setembro, o concelho de Amarante assinala as Jornadas Europeias do Património com uma vasta programação cultural e de descoberta do património construído e imaterial. O programa integra percursos temáticos pelas margens do rio Tâmega e visitas noturnas ao Mosteiro de São Gonçalo.\n\nA freguesia de Figueiró estará em destaque com um percurso pedestre guiado pelos antigos moinhos de água e capelas históricas, convidando os participantes a redescobrir as lendas, ofícios ancestrais e a arquitetura rural da nossa terra.\n\nTodas as atividades são gratuitas e destinadas a famílias, amantes da natureza e a todos os que valorizam a identidade cultural da nossa região.",
    date: "14 Setembro, 2026",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800"
  },
  {
    id: "f3",
    title: "Cineteatro de Amarante Apresenta Temporada Cultural de Outono com Grandes Espetáculos",
    excerpt: "A nova programação arranca este mês trazendo fado contemporâneo, teatro nacional e sessões de cinema de autor ao coração da cidade.",
    content: "O Cineteatro de Amarante divulgou a sua ambiciosa programação cultural para os meses de outono. A nova temporada abre com grandes nomes da música portuguesa, ciclos de teatro comunitário e concertos intimistas de fado e guitarras clássicas.\n\nAs associações culturais de Figueiró e das freguesias vizinhas marcarão presença em mostras de artes cénicas e encontros musicais, promovendo jovens talentos e tradições orais.\n\nOs ouvintes da Web Rádio Figueiró poderão acompanhar antevisões exclusivas e entrevistas com os artistas convidados na nossa emissão diária.",
    date: "11 Setembro, 2026",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800"
  },
  {
    id: "f4",
    title: "Web Rádio Figueiró Estreia Grelha de Outono com Novos Programas Dedicados à Diáspora",
    excerpt: "A estação renova a emissão com a rubrica 'Pontes de Saudade' e reforça a transmissão em direto de eventos culturais locais.",
    content: "Com a chegada do outono, a Web Rádio Figueiró lança uma grelha de programação renovada, reforçando a ligação com a comunidade de ouvintes locais e com os milhares de portugueses no estrangeiro. Entre as estreias destaca-se o programa semanal 'Pontes de Saudade', que conecta famílias de Figueiró a familiares residentes em França, Suíça e nas Américas.\n\nA grelha inclui ainda reportagens matinais sobre a vida associativa de Amarante, informação meteorológica rural e os grandes clássicos da música popular e ligeira portuguesa.\n\nA direção da rádio agradece o apoio contínuo de todos os ouvintes que acompanham a emissão diária em Alta Definição através da nossa plataforma.",
    date: "08 Setembro, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800"
  }
];

const FALLBACK_NEWS_EN: NewsItem[] = [
  {
    id: "f1",
    title: "Grape Harvest in Amarante and Figueiró Anticipates Outstanding Vinho Verde",
    excerpt: "The harvest season kicks off across Tâmega slopes and Figueiró vineyards, with winemakers forecasting high-quality wine.",
    content: "Wineries and vineyard estates across the Amarante sub-region and the parish of Figueiró have launched the traditional autumn harvest. Thanks to a summer with crisp nights and mild sunny days, indigenous grape varieties including Azal, Avesso, and Pedernã boast optimal ripeness and vibrant acidity.\n\nIn Figueiró, local growers maintain manual harvesting and granite stone pressing traditions. The harvest brings renewed community warmth to the wine cellars, joining neighbors and diaspora families enjoying the season.\n\nWeb Rádio Figueiró will cover local stories, harvest customs, and the authentic winemaking heritage of our region throughout September.",
    date: "September 16, 2026",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800"
  },
  {
    id: "f2",
    title: "Amarante Celebrates European Heritage Days with Guided Routes and Music by the Tâmega",
    excerpt: "Historic landmarks, scenic bridges, and heritage trails in Figueiró welcome visitors with free guided tours in late September.",
    content: "From September 25 to 27, the municipality of Amarante celebrates European Heritage Days with open-air events, cultural trails, and musical showcases along the scenic Tâmega River.\n\nThe parish of Figueiró will be in the spotlight with an interpretive walking trail through historic watermills and chapels, inviting participants to explore centuries of local folklore, stone masonry, and pastoral traditions.\n\nAll activities are free and designed for families, nature lovers, and cultural heritage enthusiasts.",
    date: "September 14, 2026",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800"
  },
  {
    id: "f3",
    title: "Amarante Cine-Theater Announces Autumn Season Featuring Fado, Theater, and Cinema",
    excerpt: "The new cultural lineup launches this month, bringing acclaimed Portuguese artists and community productions to the city.",
    content: "The Amarante Cine-Theater has unveiled its rich cultural programme for the autumn months. Highlights include intimate fado concerts, award-winning contemporary drama, and independent film screenings followed by audience discussions.\n\nLocal associations from Figueiró and surrounding parishes will present community performances, showcasing regional talent and living memories.\n\nWeb Rádio Figueiró listeners can tune in for exclusive previews and artist interviews on our daily broadcast.",
    date: "September 11, 2026",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800"
  },
  {
    id: "f4",
    title: "Web Rádio Figueiró Debuts Autumn Programming Dedicated to the Global Diaspora",
    excerpt: "The radio station refreshes its broadcast schedule with new community shows and enhanced regional coverage.",
    content: "With autumn underway, Web Rádio Figueiró has premiered an updated programming lineup designed to bridge local communities and emigrants abroad. The flagship addition is the weekly live show 'Bridges of Saudade', connecting residents in Figueiró with relatives living in France, Switzerland, and the Americas.\n\nThe schedule also includes daily morning reports on local agricultural life, weather forecasts, and timeless Portuguese classics.\n\nThe management expresses sincere appreciation to all listeners tuning into our crystal-clear HD broadcast worldwide.",
    date: "September 08, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800"
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
