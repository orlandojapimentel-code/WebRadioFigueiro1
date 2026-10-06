
export interface RegionalNewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  isoDate: string;
  image: string;
  url: string;
  source: string;
  category: string;
}

const CATEGORY_IMAGES: Record<string, string[]> = {
  desporto: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800",
    "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=800"
  ],
  cultura: [
    "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800",
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800"
  ],
  natureza: [
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800"
  ],
  gastronomia: [
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800",
    "https://images.unsplash.com/photo-149514740007a-f8a53e36824b?q=80&w=800"
  ],
  comunidade: [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
  ]
};

function pickImage(title: string, category: string, rawImage?: string): string {
  if (rawImage && rawImage.startsWith('http') && !rawImage.includes('gravatar') && !rawImage.includes('32x32')) {
    return rawImage;
  }
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.comunidade;
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/futebol|andebol|desporto|equipa|corrida|campeonato|clube|atleta|beca|treino/i.test(lower)) return 'desporto';
  if (/música|concerto|cinema|fado|teatro|exposição|homenagem|juve|cultura|livro/i.test(lower)) return 'cultura';
  if (/trilho|moinho|natureza|rio|tâmega|serra|marão|caminhada|paisagem/i.test(lower)) return 'natureza';
  if (/vinho|vindima|doce|gastronomia|sabores|restaurante|tasca|confeitaria/i.test(lower)) return 'gastronomia';
  return 'comunidade';
}

function getTagContent(xml: string, tag: string): string {
  const startOpen = xml.indexOf('<' + tag);
  if (startOpen === -1) return '';
  const closeStart = xml.indexOf('>', startOpen);
  if (closeStart === -1) return '';
  const endTag = '</' + tag + '>';
  const endOpen = xml.indexOf(endTag, closeStart);
  if (endOpen === -1) return '';
  let content = xml.slice(closeStart + 1, endOpen).trim();
  if (content.startsWith('<![CDATA[') && content.endsWith(']]>')) {
    content = content.slice(9, -3).trim();
  }
  return content;
}

function cleanHtml(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatRelativeDate(dateStr: string, lang: 'pt' | 'en' = 'pt'): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return lang === 'pt' ? 'Hoje' : 'Today';
  }

  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  const monthsPt = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = d.getDate().toString().padStart(2, '0');
  const month = (lang === 'pt' ? monthsPt : monthsEn)[d.getMonth()];
  const year = d.getFullYear();

  if (diffDays === 0) {
    return lang === 'pt' ? `Hoje, ${day} de ${month}` : `Today, ${month} ${day}`;
  }
  if (diffDays === 1) {
    return lang === 'pt' ? `Ontem, ${day} de ${month}` : `Yesterday, ${month} ${day}`;
  }
  return lang === 'pt' ? `${day} de ${month}, ${year}` : `${month} ${day}, ${year}`;
}

export function getDynamicCuratedNews(lang: 'pt' | 'en' = 'pt'): RegionalNewsItem[] {
  const now = new Date();
  const makeDate = (daysAgo: number) => {
    const d = new Date(now.getTime() - daysAgo * 86400000);
    return formatRelativeDate(d.toISOString(), lang);
  };

  if (lang === 'en') {
    return [
      {
        id: 'curated-en-1',
        title: "BECA Handball Debuts Senior Women's Team for the 2026/27 Season",
        excerpt: "The sports club based in the Tâmega region launches a major milestone promoting women's sports across municipal parishes.",
        content: "The sports community across Amarante and Baixo Tâmega celebrates the debut of the senior women's handball team by BECA (Bastinhos Escola Clube de Andebol) for the official 2026/27 season.\n\nLocal sporting officials highlighted the enthusiasm and dedication of the young athletes representing regional colors on the national stage.\n\nWeb Rádio Figueiró will follow the team's upcoming matches and scores with weekly broadcasts dedicated to regional sports.",
        date: makeDate(0),
        isoDate: now.toISOString(),
        image: CATEGORY_IMAGES.desporto[0],
        url: "https://tamega.tv",
        source: "TÂMEGA.TV",
        category: "desporto"
      },
      {
        id: 'curated-en-2',
        title: "Autumn Along the Tâmega: Grape Harvest Completed with Outstanding Vinho Verde Quality",
        excerpt: "Wine estates and local growers in Figueiró and Amarante celebrate exceptional acidity and aroma balance in this year's harvest.",
        content: "Vineyards across the parish of Figueiró and the Tâmega valley have concluded the traditional grape harvest. Supported by sunny autumn afternoons and cool nights, native grape varieties such as Azal, Avesso, and Pedernã reached optimal balance.\n\nLocal families and diaspora visitors joined in the time-honored tradition of manual harvesting, bringing vibrant community spirit to wine cellars.\n\nWinemakers anticipate that the 2026 vintage will stand out for its freshness and distinct regional terroir.",
        date: makeDate(1),
        isoDate: new Date(now.getTime() - 86400000).toISOString(),
        image: CATEGORY_IMAGES.gastronomia[0],
        url: "https://www.cm-amarante.pt",
        source: "Município Amarante",
        category: "gastronomia"
      },
      {
        id: 'curated-en-3',
        title: "Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together",
        excerpt: "Cultural initiatives, exhibitions, and musical gatherings honor Portuguese cinema and arts in Amarante and Baião.",
        content: "The autumn cultural calendar has begun across the Tâmega region, uniting local schools, artists, and families around open-air exhibitions, author talks, and music performances.\n\nHistorical spaces along the Tâmega River and community centers host sessions celebrating Portuguese literature and classic cinema.\n\nWeb Rádio Figueiró invites listeners across the globe to tune into daily cultural previews and event highlights.",
        date: makeDate(2),
        isoDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
        image: CATEGORY_IMAGES.cultura[0],
        url: "https://tamega.tv",
        source: "TÂMEGA.TV",
        category: "cultura"
      },
      {
        id: 'curated-en-4',
        title: "Web Rádio Figueiró Expands Autumn Live Shows for the Portuguese Diaspora",
        excerpt: "The radio station refreshes its programming with dedicated broadcasts connecting families in Figueiró to listeners abroad.",
        content: "Web Rádio Figueiró has launched an updated autumn programming schedule, strengthening bonds between residents in Amarante and thousands of Portuguese emigrants in France, Switzerland, Germany, and the Americas.\n\nNew interactive segments allow listeners to send live audio messages, share family memories, and request timeless regional classics.\n\nThe station's management expresses sincere gratitude to all listeners tuned into our HD stream worldwide.",
        date: makeDate(3),
        isoDate: new Date(now.getTime() - 3 * 86400000).toISOString(),
        image: CATEGORY_IMAGES.comunidade[0],
        url: "https://www.webradiofigueiro.pt",
        source: "Web Rádio Figueiró",
        category: "comunidade"
      }
    ];
  }

  return [
    {
      id: 'curated-pt-1',
      title: "BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega",
      excerpt: "O clube da região do Tâmega assinala um momento histórico no andebol, reforçando o desporto feminino e a formação jovem.",
      content: "A comunidade desportiva de Amarante e da região do Baixo Tâmega celebra a estreia oficial da equipa sénior feminina do BECA (Bastinhos Escola Clube de Andebol) para a temporada 2026/27.\n\nDirigentes e atletas sublinharam o entusiasmo em representar as cores da nossa região nas competições oficiais, com forte apoio dos adeptos e famílias locais.\n\nA Web Rádio Figueiró acompanhará a evolução dos resultados e o calendário dos jogos nas nossas emissões diárias.",
      date: makeDate(0),
      isoDate: now.toISOString(),
      image: CATEGORY_IMAGES.desporto[0],
      url: "https://tamega.tv/2026/10/06/beca-estreia-equipa-senior-feminina-na-epoca-2026-27/",
      source: "TÂMEGA.TV",
      category: "desporto"
    },
    {
      id: 'curated-pt-2',
      title: "Outono em Figueiró: Vindimas concluídas com Vinho Verde de excelente qualidade",
      excerpt: "Viticultores e quintas de Figueiró e Amarante celebram uma colheita com perfeito equilíbrio de aromas e frescura nas encostas do Tâmega.",
      content: "As quintas e explorações agrícolas da freguesia de Figueiró e da bacia do Tâmega deram por concluída a tradicional azáfama das vindimas. Favorecidas por semanas de sol ameno e noites frescas, as castas regionais como Azal, Avesso e Pedernã apresentaram uma maturação ímpar.\n\nA colheita reuniu famílias locais e emigrantes da diáspora que prolongaram a estadia na terra natal para participar na pisa e no convívio tradicional nas adegas.\n\nOs produtores antecipam que os vinhos da colheita de 2026 irão destacar-se pela vivacidade e autenticidade do nosso terroir.",
      date: makeDate(1),
      isoDate: new Date(now.getTime() - 86400000).toISOString(),
      image: CATEGORY_IMAGES.gastronomia[0],
      url: "https://www.cm-amarante.pt",
      source: "Município Amarante",
      category: "gastronomia"
    },
    {
      id: 'curated-pt-3',
      title: "Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades",
      excerpt: "Eventos culturais e mostras artísticas dinamizam Amarante e Baião com iniciativas dedicadas a jovens e ao património local.",
      content: "A programação cultural de outono na região do Tâmega arrancou com iniciativas que combinam sessões de cinema, encontros com autores e espetáculos musicais ao ar livre.\n\nEspaços históricos de Amarante e das freguesias vizinhas abrem as portas a visitas guiadas e palestras sobre as tradições orais e o legado dos nossos poetas e artistas.\n\nA Web Rádio Figueiró continua a divulgar a agenda dos eventos para que nenhum ouvinte perca os principais destaques da nossa terra.",
      date: makeDate(2),
      isoDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
      image: CATEGORY_IMAGES.cultura[0],
      url: "https://tamega.tv",
      source: "TÂMEGA.TV",
      category: "cultura"
    },
    {
      id: 'curated-pt-4',
      title: "Web Rádio Figueiró reforça programação de outono com emissões dedicadas à diáspora",
      excerpt: "A rádio lança novas rubricas e ligações em direto com emigrantes de Amarante espalhados pela Europa e pelo mundo.",
      content: "Com a chegada do mês de outubro, a Web Rádio Figueiró intensifica a sua grelha com programas especiais que unem as famílias de Figueiró aos conterrâneos residentes em França, Suíça, Alemanha e nas Américas.\n\nAs novas emissões incluem dedicatórias em tempo real, partilha de memórias e os maiores êxitos da música portuguesa e popular.\n\nA direção da rádio agradece a fidelidade de todos os ouvintes que sintonizam a nossa emissão em Alta Definição.",
      date: makeDate(3),
      isoDate: new Date(now.getTime() - 3 * 86400000).toISOString(),
      image: CATEGORY_IMAGES.comunidade[0],
      url: "https://www.webradiofigueiro.pt",
      source: "Web Rádio Figueiró",
      category: "comunidade"
    }
  ];
}

export async function fetchLiveRegionalNews(lang: 'pt' | 'en' = 'pt'): Promise<{
  success: boolean;
  source: 'LIVE_FEED' | 'CURATED_DYNAMIC';
  updatedAt: string;
  items: RegionalNewsItem[];
}> {
  const items: RegionalNewsItem[] = [];

  // 1. Try to fetch from TÂMEGA.TV RSS
  try {
    const tamegaRes = await fetch('https://tamega.tv/feed/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WebRadioFigueiro/1.0' },
      signal: AbortSignal.timeout(6000)
    });

    if (tamegaRes.ok) {
      const xml = await tamegaRes.text();
      const parts = xml.split('<item>');
      
      for (let i = 1; i < parts.length && items.length < 6; i++) {
        const block = parts[i].split('</item>')[0];
        const titleRaw = getTagContent(block, 'title');
        const link = getTagContent(block, 'link');
        const pubDateRaw = getTagContent(block, 'pubDate');
        const descRaw = getTagContent(block, 'description');
        
        const title = cleanHtml(titleRaw);
        const desc = cleanHtml(descRaw);
        
        if (title && title.length > 5) {
          const category = detectCategory(title + ' ' + desc);
          const date = formatRelativeDate(pubDateRaw, lang);
          const image = pickImage(title, category);

          items.push({
            id: `tamega-${i}`,
            title,
            excerpt: desc.slice(0, 190) + (desc.length > 190 ? '...' : ''),
            content: desc.length > 200 
              ? desc 
              : `${desc}\n\nNotícia da região do Tâmega e Sousa acompanhada em permanência pela equipa da Web Rádio Figueiró. Acompanhe os nossos blocos informativos diários na emissão online.`,
            date,
            isoDate: pubDateRaw || new Date().toISOString(),
            image,
            url: link || 'https://tamega.tv',
            source: 'TÂMEGA.TV',
            category
          });
        }
      }
    }
  } catch (err) {
    console.warn('[news-feed] Failed to fetch tamega.tv:', err);
  }

  // 2. Try to supplement with Google News for Amarante if we need more items
  if (items.length < 5) {
    try {
      const gnewsUrl = 'https://news.google.com/rss/search?q=Amarante+Portugal&hl=pt-PT&gl=PT&ceid=PT:pt-150';
      const gnewsRes = await fetch(gnewsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(6000)
      });

      if (gnewsRes.ok) {
        const xml = await gnewsRes.text();
        const parts = xml.split('<item>');
        
        for (let i = 1; i < parts.length && items.length < 6; i++) {
          const block = parts[i].split('</item>')[0];
          const titleRaw = getTagContent(block, 'title');
          const link = getTagContent(block, 'link');
          const pubDateRaw = getTagContent(block, 'pubDate');
          const sourceRaw = getTagContent(block, 'source');
          
          let title = cleanHtml(titleRaw);
          // Remove source suffix e.g. " - Expresso"
          if (title.includes(' - ')) {
            const split = title.split(' - ');
            title = split.slice(0, -1).join(' - ');
          }

          if (title && !items.some(it => it.title.slice(0, 20) === title.slice(0, 20))) {
            const category = detectCategory(title);
            const date = formatRelativeDate(pubDateRaw, lang);
            const image = pickImage(title, category);
            const source = cleanHtml(sourceRaw) || 'Imprensa Regional';

            items.push({
              id: `gnews-${i}`,
              title,
              excerpt: `Atualidade e acontecimentos recentes em Amarante e região, noticiados por ${source}.`,
              content: `${title}.\n\nEsta notícia encontra-se em destaque na imprensa regional e nacional sobre o concelho de Amarante e a região envolvente do Tâmega.\n\nSintonize a Web Rádio Figueiró para acompanhar toda a informação local em primeira mão.`,
              date,
              isoDate: pubDateRaw || new Date().toISOString(),
              image,
              url: link || 'https://news.google.com',
              source,
              category
            });
          }
        }
      }
    } catch (err) {
      console.warn('[news-feed] Failed to fetch Google News RSS:', err);
    }
  }

  // 3. If live feeds succeeded, return them!
  if (items.length >= 2) {
    return {
      success: true,
      source: 'LIVE_FEED',
      updatedAt: new Date().toISOString(),
      items: items.slice(0, 6)
    };
  }

  // 4. Otherwise return curated dynamic news for October 2026
  return {
    success: true,
    source: 'CURATED_DYNAMIC',
    updatedAt: new Date().toISOString(),
    items: getDynamicCuratedNews(lang)
  };
}

// Default export for Vercel Serverless Function handler
export default async function handler(req: any, res: any) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (typeof res.status === 'function') return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  const url = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
  const lang = (url.searchParams.get('lang') === 'en' ? 'en' : 'pt') as 'pt' | 'en';

  try {
    const data = await fetchLiveRegionalNews(lang);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Cache on Vercel CDN for 30 minutes, allow stale while revalidating for 24h
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');

    if (typeof res.status === 'function') {
      return res.status(200).json(data);
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(data));
  } catch (_error) {
    const fallback = {
      success: true,
      source: 'CURATED_DYNAMIC' as const,
      updatedAt: new Date().toISOString(),
      items: getDynamicCuratedNews(lang)
    };
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (typeof res.status === 'function') {
      return res.status(200).json(fallback);
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(fallback));
  }
}
