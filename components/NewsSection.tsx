import React, { useState, useEffect } from 'react';
import { fetchDetailedNews } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { MEDIA_ASSETS } from '../src/mediaAssets';

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

const FALLBACK_IMAGES = [
  MEDIA_ASSETS.tamegaHeritageBanner,
  MEDIA_ASSETS.newsFallbackCommunity,
  MEDIA_ASSETS.culturalEventsStage,
  MEDIA_ASSETS.heroStudioAmarante,
];

const FALLBACK_NEWS_PT: NewsItem[] = [
  {
    id: 'f1',
    title: 'BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega',
    excerpt: 'O clube da região do Tâmega assinala um momento histórico no andebol, reforçando o desporto feminino e a formação jovem.',
    content:
      'A comunidade desportiva de Amarante e da região do Baixo Tâmega celebra a estreia oficial da equipa sénior feminina do BECA (Bastinhos Escola Clube de Andebol) para a temporada 2026/27.\n\nDirigentes e atletas sublinharam o entusiasmo em representar as cores da nossa terra nas competições oficiais, com forte apoio das famílias e adeptos locais.\n\nA Web Rádio Figueiró acompanhará a evolução dos resultados e o calendário dos jogos nas nossas emissões desportivas.',
    date: 'Hoje',
    image: MEDIA_ASSETS.newsFallbackCommunity,
    url: 'https://tamega.tv/2026/10/06/beca-estreia-equipa-senior-feminina-na-epoca-2026-27/',
    source: 'TÂMEGA.TV',
  },
  {
    id: 'f2',
    title: 'Outono em Figueiró: Vindimas concluídas com Vinho Verde de excelente qualidade',
    excerpt: 'Viticultores e quintas de Figueiró e Amarante celebram uma colheita com perfeito equilíbrio de aromas e frescura nas encostas do Tâmega.',
    content:
      'As quintas e vinhedos da freguesia de Figueiró e do vale do Tâmega concluíram com sucesso a tradicional faina das vindimas de outono. Favorecidas por semanas de sol ameno e noites frescas, as castas regionais como Azal, Avesso e Pedernã apresentaram uma maturação ímpar.\n\nA colheita reuniu famílias locais e emigrantes da diáspora que prolongaram a estadia na terra natal para participar na pisa e no convívio tradicional nas adegas.\n\nOs produtores antecipam que os vinhos da colheita de 2026 irão destacar-se pela vivacidade e autenticidade do nosso terroir.',
    date: 'Ontem',
    image: MEDIA_ASSETS.tamegaHeritageBanner,
    url: 'https://www.cm-amarante.pt',
    source: 'Município Amarante',
  },
  {
    id: 'f3',
    title: 'Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades',
    excerpt: 'Eventos culturais e mostras artísticas dinamizam Amarante e o Tâmega com iniciativas dedicadas aos jovens e ao património local.',
    content:
      'A programação cultural de outono na região do Tâmega arrancou com iniciativas que combinam sessões de cinema, encontros com autores e espetáculos musicais ao ar livre.\n\nEspaços históricos de Amarante e das freguesias vizinhas abrem as portas a visitas guiadas e tertúlias sobre as tradições orais e o património construído.\n\nA Web Rádio Figueiró continua a divulgar a agenda dos eventos para que nenhum ouvinte perca os principais destaques da nossa terra.',
    date: 'Outono 2026',
    image: MEDIA_ASSETS.culturalEventsStage,
    url: 'https://tamega.tv',
    source: 'TÂMEGA.TV',
  },
  {
    id: 'f4',
    title: 'Web Rádio Figueiró reforça programação com emissões dedicadas à diáspora',
    excerpt: 'A rádio lança novas rubricas e ligações em direto com emigrantes de Amarante espalhados pela Europa e pelo mundo.',
    content:
      'A Web Rádio Figueiró intensifica a sua grelha com programas especiais que unem as famílias de Figueiró aos conterrâneos residentes em França, Suíça, Alemanha e nas Américas.\n\nAs emissões incluem dedicatórias em tempo real, partilha de memórias e os maiores êxitos da música portuguesa e popular.\n\nA direção da rádio agradece a fidelidade de todos os ouvintes que sintonizam a nossa emissão em Alta Definição.',
    date: '2026',
    image: MEDIA_ASSETS.heroStudioAmarante,
    url: 'https://www.webradiofigueiro.pt',
    source: 'Web Rádio Figueiró',
  },
];

const FALLBACK_NEWS_EN: NewsItem[] = [
  {
    id: 'f1',
    title: "BECA Handball Debuts Senior Women's Team for the 2026/27 Season",
    excerpt: "The sports club based in the Tâmega region launches a major milestone promoting women's sports across municipal parishes.",
    content:
      "The sports community across Amarante and Baixo Tâmega celebrates the debut of the senior women's handball team by BECA for the official 2026/27 season.\n\nLocal sporting officials highlighted the enthusiasm and dedication of the young athletes representing regional colors.\n\nWeb Rádio Figueiró will follow the team's upcoming matches with weekly regional sports broadcasts.",
    date: 'Today',
    image: MEDIA_ASSETS.newsFallbackCommunity,
    url: 'https://tamega.tv/2026/10/06/beca-estreia-equipa-senior-feminina-na-epoca-2026-27/',
    source: 'TÂMEGA.TV',
  },
  {
    id: 'f2',
    title: 'Autumn Along the Tâmega: Grape Harvest Completed with Outstanding Vinho Verde Quality',
    excerpt: "Wine estates and local growers in Figueiró and Amarante celebrate exceptional acidity and aroma balance in this year's harvest.",
    content:
      'Vineyards across the parish of Figueiró and the Tâmega valley have concluded the traditional grape harvest, supported by sunny autumn afternoons and cool nights.\n\nLocal families and diaspora visitors joined in manual harvesting across regional estates.\n\nWinemakers anticipate an outstanding vintage highlighting local terroir.',
    date: 'Yesterday',
    image: MEDIA_ASSETS.tamegaHeritageBanner,
    url: 'https://www.cm-amarante.pt',
    source: 'Município Amarante',
  },
  {
    id: 'f3',
    title: 'Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together',
    excerpt: 'Cultural initiatives, exhibitions, and musical gatherings honor Portuguese cinema and arts in Amarante and Baião.',
    content:
      'The cultural calendar across the Tâmega region unites local schools, artists, and families around exhibitions, author talks, and music performances.\n\nHistorical spaces along the Tâmega River host sessions celebrating Portuguese literature and cinema.\n\nWeb Rádio Figueiró invites listeners worldwide to tune into daily cultural previews.',
    date: '2026',
    image: MEDIA_ASSETS.culturalEventsStage,
    url: 'https://tamega.tv',
    source: 'TÂMEGA.TV',
  },
  {
    id: 'f4',
    title: 'Web Rádio Figueiró Expands Live Shows for the Portuguese Diaspora',
    excerpt: 'The radio station refreshes its broadcast schedule with new community shows and enhanced regional coverage.',
    content:
      'Web Rádio Figueiró continues strengthening bonds between residents in Amarante and Portuguese emigrants in France, Switzerland, Germany, and the Americas.\n\nInteractive segments allow listeners to send live audio messages and request regional classics.\n\nThank you for tuning into our HD broadcast worldwide.',
    date: '2026',
    image: MEDIA_ASSETS.heroStudioAmarante,
    url: 'https://www.webradiofigueiro.pt',
    source: 'Web Rádio Figueiró',
  },
];

const getSafeNewsImage = (rawImage?: string, index = 0): string => {
  const clean = rawImage?.trim() || '';
  if (
    clean &&
    (clean.startsWith('http://') || clean.startsWith('https://')) &&
    !clean.includes('unsplash.com') &&
    !clean.includes('placeholder')
  ) {
    return clean;
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

const NewsSection: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { language, t } = useLanguage();
  const [newsList, setNewsList] = useState<NewsItem[]>(language === 'en' ? FALLBACK_NEWS_EN : FALLBACK_NEWS_PT);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result: any = await fetchDetailedNews(language);
      if (result && result.items && Array.isArray(result.items) && result.items.length > 0) {
        const sanitized = result.items.map((item: NewsItem, idx: number) => ({
          ...item,
          image: getSafeNewsImage(item.image, idx),
        }));
        setNewsList(sanitized);
        return;
      }
      if (result && result.text) {
        const newsBlocks = result.text.match(/NOTICIA_START[\s\S]*?NOTICIA_END/g);
        if (newsBlocks && newsBlocks.length > 0) {
          const parsed = newsBlocks.map((block: string, idx: number) => {
            const extract = (key: string) => {
              const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
              const match = block.match(regex);
              return match ? match[1].trim().replace(/[*`]/g, '') : '';
            };

            return {
              id: `news-${idx}`,
              title: extract('TITULO') || 'Web Rádio Figueiró',
              date: extract('DATA') || 'Hoje',
              excerpt: extract('RESUMO'),
              content: extract('CONTEUDO'),
              image: getSafeNewsImage(extract('IMAGEM'), idx),
            };
          });
          setNewsList(parsed);
          return;
        }
      }
      setNewsList(language === 'en' ? FALLBACK_NEWS_EN : FALLBACK_NEWS_PT);
    } catch {
      setNewsList(language === 'en' ? FALLBACK_NEWS_EN : FALLBACK_NEWS_PT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 15 * 60 * 1000);
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
    <section id="noticias" className="scroll-mt-32 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 block">
            {t.news.kicker} · {t.news.autoBadge}
          </span>
          <h3 className="text-2xl sm:text-3xl font-brand font-black tracking-tight text-slate-900 dark:text-white mt-1">
            {t.news.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={loadNews}
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? t.news.loading : t.news.refresh}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {newsList.map((news, idx) => (
          <article
            key={news.id}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('close-overlays'));
              setSelectedNews(news);
            }}
            className="group glass-card glass-card-interactive cursor-pointer flex flex-col h-full overflow-hidden"
          >
            <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-200 dark:bg-slate-900">
              <img
                src={news.image}
                alt={news.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-red-600 dark:text-red-400 font-semibold">{news.date}</span>
                {news.source && (
                  <>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{news.source}</span>
                  </>
                )}
              </div>

              <h4 className="text-lg sm:text-xl font-brand font-bold tracking-tight mb-2.5 text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                {news.title}
              </h4>

              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-5 flex-grow">
                {news.excerpt}
              </p>

              <div className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
                <span>{t.news.readFull}</span>
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedNews && (
        <div
          className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={closeNews}
        >
          <div
            className="bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 p-4 sm:p-6 flex justify-end z-20 pointer-events-none">
              <button
                type="button"
                onClick={closeNews}
                className="pointer-events-auto p-2.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-xl transition-colors border border-white/10"
                aria-label={t.news.backHome}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 sm:px-10 pb-10 space-y-6 -mt-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="text-red-600 dark:text-red-400 font-bold">{selectedNews.date}</span>
                  {selectedNews.source && (
                    <>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>{selectedNews.source}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl sm:text-4xl font-brand font-black text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
                  {selectedNews.title}
                </h2>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 h-60 sm:h-80 bg-slate-100 dark:bg-slate-900">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = MEDIA_ASSETS.newsFallbackCommunity;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="max-w-prose">
                <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {selectedNews.content}
                </p>
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">
                    {selectedNews.source ? `${t.news.sourcePrefix}: ${selectedNews.source}` : t.news.editorialRoom}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Web Rádio Figueiró · Amarante
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {selectedNews.url && (
                    <a
                      href={selectedNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      {t.news.readSource}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={closeNews}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-slate-200 dark:border-white/10"
                  >
                    {t.news.backHome}
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
