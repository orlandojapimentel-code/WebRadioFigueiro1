
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
    title: "Web Rádio Figueiró Lança Aplicação Oficial com Emissão HD",
    excerpt: "A Web Rádio Figueiró acaba de lançar a sua nova plataforma digital, aproximando ainda mais a comunidade local e a diáspora a Amarante.",
    content: "A Web Rádio Figueiró, uma das principais vozes da freguesia de Figueiró e do concelho de Amarante, deu um passo histórico em direção ao futuro digital com a apresentação da sua nova aplicação oficial. A nova plataforma permite aos ouvintes desfrutar de uma emissão contínua em Alta Definição (HD), oferecendo uma experiência de som cristalino em qualquer parte do mundo.\n\nCom funções inteligentes como um assistente de inteligência artificial dedicado para pedidos de músicas, notícias regionais atualizadas e a integração direta de uma agenda cultural local, a Web Rádio Figueiró consolida o seu compromisso de liderança na divulgação cultural.\n\nEsta inovação tecnológica visa aproximar não só as populações que residem no concelho, mas também as vastas comunidades de emigrantes de Figueiró espalhadas pela Europa e pelo mundo, que agora têm um portal de excelência para se manterem ligadas às suas raízes e à música que mais gostam.",
    date: "16 Junho, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800"
  },
  {
    id: "f2",
    title: "Feira de Artesanato e Gastronomia de Amarante Promete Recorde",
    excerpt: "O certame deste ano reúne dezenas de artesãos locais e produtores do famoso vinho verde da região no centro histórico.",
    content: "A tradicional Feira de Artesanato e Gastronomia de Amarante arranca já no próximo fim de semana com a expetativa de ser a maior edição de sempre. Organizada em parceria com as associações regionais, a feira irá transformar as margens do rio Tâmega e o Largo de São Gonçalo no epicentro da cultura tradicional portuguesa.\n\nPara além de trabalhos manuais únicos em madeira, barro e tecelagem, os visitantes poderão deliciar-se com os famosos doces conventuais de Amarante e provar os vinhos verdes de produtores de Figueiró e freguesias vizinhas.\n\nA Web Rádio Figueiró terá uma equipa no local para fazer a cobertura de rádio em direto, entrevistando artesãos e visitantes e transmitindo toda a animação musical deste evento que é um orgulho para a nossa região portuguesa.",
    date: "14 Junho, 2026",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  },
  {
    id: "f3",
    title: "Roteiro dos Caminhos de São Gonçalo Revitaliza Turismo",
    excerpt: "O novo percurso pedestre e cultural que liga Figueiró ao coração histórico de Amarante já está aberto ao público.",
    content: "O turismo de Amarante conta com uma nova atração de grande valor patrimonial e ambiental. Foi inaugurado oficialmente o Roteiro Pedestre dos Caminhos de São Gonçalo, um trilho que percorre caminhos rurais históricos a partir da freguesia de Figueiró até à icónica ponte de Amarante.\n\nO trajeto, totalmente sinalizado e dotado de painéis informativos sobre a fauna, flora e lendas locais, promete atrair caminhantes, amantes da natureza e peregrinos.\n\nA iniciativa visa promover a descentralização turística na região, destacando a riqueza florestal e as belas paisagens ribeirinhas que caracterizam Figueiró e arredores, incentivando simultaneamente o comércio local.",
    date: "10 Junho, 2026",
    image: "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800"
  },
  {
    id: "f4",
    title: "Encontro de Concertinas de Figueiró Junta Gerações",
    excerpt: "As ruas de Figueiró encheram-se de ritmo e tradição musical num convívio que celebra as canções populares.",
    content: "A música tradicional portuguesa esteve em destaque no Encontro Regional de Concertinas de Figueiró, Amarante. O evento, promovido pelo grupo de folclore local, reuniu mais de uma dezena de ranchos e grupos informais de tocadores vindos de vários pontos do norte do país.\n\nAs ruas encheram-se de sons alegres e desgarradas improvisadas, atraindo centenas de espetadores de todas as idades num ambiente de festa e partilha comunitária.\n\nO sucesso da iniciativa reforça a importância de preservar e transmitir as tradições musicais locais aos mais jovens, garantindo que a identidade de Figueiró continua bem viva.",
    date: "08 Junho, 2026",
    image: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
  }
];

const FALLBACK_NEWS_EN: NewsItem[] = [
  {
    id: "f1",
    title: "Web Rádio Figueiró Launches Official App with HD Broadcasting",
    excerpt: "Web Rádio Figueiró has launched its new digital platform, bringing the local community and the diaspora closer to Amarante.",
    content: "Web Rádio Figueiró, one of the leading voices of the parish of Figueiró and the municipality of Amarante, has taken a historic step toward the digital future with the presentation of its official application. The new platform allows listeners to enjoy continuous high-definition (HD) broadcasting, offering a crystal-clear sound experience anywhere in the world.\n\nWith smart features such as a dedicated AI assistant for music requests, updated regional news, and direct integration with a local cultural agenda, Web Rádio Figueiró consolidates its leadership in cultural communication.\n\nThis technological innovation aims to connect not only local residents but also the vast communities of emigrants from Figueiró scattered across Europe and the globe, who now have an excellent portal to stay connected to their origins and the music they love.",
    date: "June 16, 2026",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800"
  },
  {
    id: "f2",
    title: "Crafts and Gastronomy Fair of Amarante Promises Record Attendance",
    excerpt: "This year's event gathers local artisans and producers of the region's famous Vinho Verde in the historic center.",
    content: "The traditional Crafts and Gastronomy Fair of Amarante kicks off next weekend with the expectation of being the largest edition ever. Organized in partnership with regional associations, the fair will transform the banks of the Tâmega River and the São Gonçalo Square into the epicenter of traditional Portuguese culture.\n\nIn addition to unique wooden, clay, and weaving handicrafts, visitors will be able to enjoy Amarante's famous conventual sweets and taste Vinho Verde wines from producers in Figueiró and neighboring parishes.\n\nWeb Rádio Figueiró will have a live broadcasting team on site, interviewing artisans and visitors to share all the musical excitement of this prideful regional event.",
    date: "June 14, 2026",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  },
  {
    id: "f3",
    title: "São Gonçalo Trail Revitalizes Regional Tourism",
    excerpt: "The new pedestrian and cultural trail connecting Figueiró to the historic heart of Amarante is now open to the public.",
    content: "Tourism in Amarante has a new attraction of great environmental and heritage value. The Pedestrian Trail of São Gonçalo was officially inaugurated, walking through historic rural paths from the parish of Figueiró to the iconic Amarante bridge.\n\nThe trail, fully signposted with informative panels about local fauna, flora, and legends, promises to attract hikers, nature lovers, and pilgrims.\n\nThis initiative aims to promote tourism decentralization in the region, highlighting the forest and river landscapes of Figueiró, while boosting the local economy.",
    date: "June 10, 2026",
    image: "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800"
  },
  {
    id: "f4",
    title: "Concertina Meeting of Figueiró Unites Generations",
    excerpt: "The streets of Figueiró filled with rhythm and traditional music in a gathering that celebrates regional folk songs.",
    content: "Traditional Portuguese music took center stage at the Regional Concertina Meeting in Figueiró, Amarante. The event, promoted by the local folklore group, brought together more than a dozen groups and individual players from all over northern Portugal.\n\nThe streets were filled with happy sounds and improvised folk songs, attracting hundreds of spectators of all ages in an atmosphere of sharing and joy.\n\nThe success of this initiative strengthens the preservation of local musical traditions, ensuring that the identity of Figueiró remains vibrant for future generations.",
    date: "June 08, 2026",
    image: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
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
