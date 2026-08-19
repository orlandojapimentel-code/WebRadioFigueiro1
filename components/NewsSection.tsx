
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
    title: "Festas de São Bartolomeu em Amarante Arrancam esta Semana com Grande Cartaz",
    excerpt: "O centro histórico de Amarante recebe cinco dias de grande animação popular, concertos, folclore e fogo de artifício no Tâmega.",
    content: "O concelho de Amarante prepara-se para acolher uma das suas celebrações de verão mais aguardadas: as tradicionais Festas de São Bartolomeu, que decorrem de 20 a 24 de agosto. Durante quase uma semana, as margens do rio Tâmega e o Largo de São Gonçalo transformam-se num epicentro vibrante de cultura, música popular e convívio comunitário.\n\nA programação inclui concertos de artistas nacionais, atuações de bandas filarmónicas, encontros de grupos de bombos e ranchos folclóricos da região — com especial destaque para os costumes e trajes de Figueiró. O momento alto das festividades será o majestoso espetáculo piromusical sobre as águas do rio Tâmega.\n\nA Web Rádio Figueiró estará em direto no local com estúdio móvel e reportagens exclusivas, transmitindo a emoção das festas aos ouvintes em Amarante e à comunidade emigrante na diáspora.",
    date: "18 Agosto, 2026",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  },
  {
    id: "f2",
    title: "Figueiró Celebra com Sucesso Festa de Nossa Senhora do Moreira e Prepara Encontro Cultural",
    excerpt: "A comunidade de Figueiró acolheu centenas de fiéis e emigrantes nas suas celebrações anuais, reforçando a união e tradição paroquial.",
    content: "A freguesia de Figueiró viveu dias de profunda alegria e comunhão com a celebração da tradicional Festa em Honra de Nossa Senhora do Moreira. As cerimónias religiosas, marcadas pela solene procissão com andores ricamente ornamentados por flores naturais, atraíram centenas de residentes e emigrantes em férias na terra natal.\n\nPara além da componente religiosa, as noites foram animadas por espetáculos de variedades, desgarradas e cantares ao desafio, demonstrando a vitalidade do património etnográfico local.\n\nA comissão de festas expressou um agradecimento caloroso a todos os que contribuíram para o sucesso deste reencontro comunitário e anunciou já um próximo convívio de outono.",
    date: "16 Agosto, 2026",
    image: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
  },
  {
    id: "f3",
    title: "Noite Branca de Amarante Marcada para 29 de Agosto Ilumina as Margens do Rio Tâmega",
    excerpt: "Múltiplos palcos, performances de artes de rua, DJs e gastronomia regional vestem o centro histórico de branco até de madrugada.",
    content: "A magia da Noite Branca está de regresso a Amarante no próximo dia 29 de agosto, prometendo reunir milhares de visitantes vestidos a rigor. As ruas e praças do centro histórico acolherão múltiplos palcos musicais com géneros que vão do pop/rock à música eletrónica, além de estátuas vivas, artes circenses e espetáculos visuais de luz.\n\nOs restaurantes, esplanadas e comércio tradicional permanecerão abertos com ementas especiais destacando os vinhos verdes da sub-região de Amarante e a tradicional doçaria conventual.\n\nA equipa da Web Rádio Figueiró acompanhará toda a emissão em tempo real com entrevistas a artistas, comerciantes e visitantes.",
    date: "14 Agosto, 2026",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800"
  },
  {
    id: "f4",
    title: "Web Rádio Figueiró Atinge Recorde Histórico de Audiência Digital na Europa e Américas",
    excerpt: "A nova plataforma digital com transmissão em Alta Definição (HD) e assistente inteligente conecta mais de 50 mil ouvintes.",
    content: "A Web Rádio Figueiró consolidou este mês a sua posição de liderança como o maior veículo de ligação entre o concelho de Amarante e as comunidades de emigrantes portugueses espalhadas pelo mundo. Dados recentes de audiência digital registam um crescimento recorde após o lançamento da nova aplicação móvel com som HD e assistente musical inteligente.\n\nOuvintes em países como França, Suíça, Alemanha, Luxemburgo, Estados Unidos e Brasil destacam a facilidade de pedir músicas, ouvir notícias locais em tempo real e acompanhar os eventos culturais de Figueiró.\n\nA direção da rádio agradece a fidelidade de todos e reafirma a sua dedicação incondicional à promoção da cultura, da música portuguesa e das gentes de Figueiró.",
    date: "11 Agosto, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800"
  }
];

const FALLBACK_NEWS_EN: NewsItem[] = [
  {
    id: "f1",
    title: "São Bartolomeu Festivities in Amarante Kick Off This Week with Stellar Line-up",
    excerpt: "The historic center of Amarante hosts five days of live concerts, folklore, street entertainment, and fireworks over the Tâmega River.",
    content: "The municipality of Amarante is ready to host one of its most celebrated summer traditions: the São Bartolomeu Festivities, running from August 20 to 24. For nearly a week, the riverbanks of the Tâmega and São Gonçalo Square become the vibrant epicenter of Portuguese culture, traditional music, and joyful community life.\n\nThe official schedule includes performances by renowned national artists, philharmonic bands, drumming groups, and local folk dance troupes — highlighting the rich heritage and traditional costumes of Figueiró. The grand finale will feature a stunning pyromusical fireworks show over the Tâmega River.\n\nWeb Rádio Figueiró will broadcast live from the venue, connecting local listeners and diaspora families worldwide.",
    date: "August 18, 2026",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  },
  {
    id: "f2",
    title: "Figueiró Successfully Celebrates Nossa Senhora do Moreira Festivities with Community Reunion",
    excerpt: "The parish of Figueiró welcomed hundreds of devotees and returning emigrants for annual religious and folk celebrations.",
    content: "The parish of Figueiró experienced days of profound warmth and unity during the traditional festivities in honor of Nossa Senhora do Moreira. The solemn religious procession, adorned with handmade natural flower arrangements, drew hundreds of local residents and overseas families visiting their hometown for summer vacation.\n\nEvenings featured lively folk concerts, accordion challenges, and traditional games, highlighting the strength of regional heritage.\n\nThe organizing committee thanked all volunteers and attendees for making this reunion unforgettable and announced upcoming autumn gatherings.",
    date: "August 16, 2026",
    image: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
  },
  {
    id: "f3",
    title: "Amarante White Night Set for August 29 to Light Up the Tâmega Riverbanks",
    excerpt: "Multiple concert stages, street art performances, DJs, and regional gastronomy will turn the historic center white until dawn.",
    content: "The magic of the Amarante White Night returns on August 29, promising to attract thousands of visitors dressed in all-white attire. The streets and scenic squares will host multiple music stages spanning pop/rock and electronic beats, alongside living statues, circus arts, and light installations.\n\nLocal restaurants, terraces, and shops will remain open late, serving regional Vinho Verde and traditional conventual sweets.\n\nWeb Rádio Figueiró will provide live on-air reporting with exclusive artist interviews and audience reactions throughout the evening.",
    date: "August 14, 2026",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800"
  },
  {
    id: "f4",
    title: "Web Rádio Figueiró Hits Record Digital Audience Across Europe and the Americas",
    excerpt: "The new digital broadcasting platform with HD audio and AI music requests connects more than 50,000 active listeners.",
    content: "Web Rádio Figueiró has solidified its standing as the primary cultural bridge connecting Amarante and Figueiró to Portuguese diaspora communities worldwide. Recent metrics show unprecedented digital growth following the release of the updated mobile application featuring crystal-clear HD streaming and an intelligent music assistant.\n\nListeners in France, Switzerland, Germany, Luxembourg, the United States, and Brazil praised the platform for seamless music requests and live regional news.\n\nStation management expressed heartfelt gratitude to all listeners and pledged continued commitment to promoting Portuguese culture and community ties.",
    date: "August 11, 2026",
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
      console.error("Error loading news in component:", error);
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
