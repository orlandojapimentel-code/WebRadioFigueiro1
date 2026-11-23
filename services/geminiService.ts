import { Language } from "../translations";

// Simple in-memory cache to avoid redundant API calls and respect rate limits
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const FALLBACK_NEWS_PT_DATA = [
  "BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega",
  "Outono em Figueiró: Vindimas concluídas com Vinho Verde de excelente qualidade",
  "Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades",
  "Web Rádio Figueiró reforça programação de outono com emissões dedicadas à diáspora",
  "Trilhos dos Moinhos de Água de Figueiró atraem caminhantes em roteiros de outono"
].join('\n');

const FALLBACK_NEWS_EN_DATA = [
  "BECA Handball Debuts Senior Women's Team for the 2026/27 Season",
  "Autumn Along the Tâmega: Grape Harvest Completed with Outstanding Vinho Verde Quality",
  "Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together",
  "Web Rádio Figueiró Expands Autumn Live Shows for the Portuguese Diaspora",
  "Figueiró Watermill Trails Welcome Walkers and Nature Enthusiasts"
].join('\n');

export const fetchLatestNews = async (lang: Language = 'pt') => {
  const cacheKey = `news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data as { text: string; source: 'LIVE' | 'LOCAL'; items?: any[] };
  }

  try {
    const res = await fetch(`/api/news?lang=${lang}`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      if (json && json.items && json.items.length > 0) {
        const text = json.items.map((it: any) => it.title).join('\n');
        const result = {
          text,
          source: (json.source === 'LIVE_FEED' ? 'LIVE' : 'LOCAL') as 'LIVE' | 'LOCAL',
          items: json.items
        };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    }
  } catch (err) {
    console.warn("fetchLatestNews /api/news failed, using local news snapshot:", err);
  }

  const fallbackData = lang === 'pt' ? FALLBACK_NEWS_PT_DATA : FALLBACK_NEWS_EN_DATA;
  return { text: fallbackData, source: 'LOCAL' as const };
};

export const fetchCulturalEvents = async (): Promise<{ text: string }> => {
  const cacheKey = 'cultural_events';
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data as { text: string };
  }

  const res = await fetch('/api/cultural-events', { signal: AbortSignal.timeout(20000) });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((json as { error?: string }).error || `Server error (${res.status})`);
  }

  if (!json || typeof json.text !== 'string' || json.text.trim().length === 0) {
    throw new Error('Empty cultural events response from server.');
  }

  const result = { text: json.text };
  cache[cacheKey] = { data: result, timestamp: now };
  return result;
};

const FALLBACK_DETAILED_NEWS_PT_STR = `
NOTICIA_START
TITULO: BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega
DATA: Hoje
RESUMO: O clube da região do Tâmega assinala um momento histórico no andebol regional, reforçando o desporto feminino e a formação jovem.
CONTEUDO: A comunidade desportiva de Amarante e da região do Baixo Tâmega celebra a estreia oficial da equipa sénior feminina do BECA (Bastinhos Escola Clube de Andebol) para a temporada 2026/27.\n\nDirigentes e atletas sublinharam o entusiasmo em representar as cores da nossa terra nas competições oficiais, contando com o apoio caloroso das famílias e adeptos locais.\n\nA Web Rádio Figueiró acompanhará a evolução dos resultados e o calendário dos jogos nas nossas emissões diárias de desporto.
IMAGEM: https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Outono em Figueiró: Vindimas concluídas com Vinho Verde de excelente qualidade
DATA: Ontem
RESUMO: Viticultores e quintas de Figueiró e Amarante celebram uma colheita com perfeito equilíbrio de aromas e frescura nas encostas do Tâmega.
CONTEUDO: As quintas e vinhedos da freguesia de Figueiró e do vale do Tâmega concluíram com sucesso a tradicional faina das vindimas de outono. Favorecidas por semanas de sol ameno e noites frescas, as castas regionais como Azal, Avesso e Pedernã apresentaram uma maturação equilibrada.\n\nA época juntou mais uma vez produtores locais e familiares da diáspora que aproveitaram a estadia para manter viva a tradição da colheita manual e da pisa tradicional em lagares de granito.\n\nOs enólogos e produtores anteveem vinhos de grande frescura e tipicidade única na colheita deste ano.
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades
DATA: 04 de Outubro, 2026
RESUMO: Eventos culturais e mostras artísticas dinamizam Amarante e o Tâmega com iniciativas dedicadas aos jovens e ao património local.
CONTEUDO: A programação cultural de outono na região do Tâmega arrancou com iniciativas que combinam sessões de cinema, encontros com autores e espetáculos musicais ao ar livre.\n\nEspaços históricos de Amarante e das freguesias vizinhas abrem as portas a visitas guiadas e tertúlias sobre as tradições orais e o património construído.\n\nA Web Rádio Figueiró continua a divulgar a agenda dos eventos para que nenhum ouvinte perca os principais destaques da nossa terra.
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró reforça programação de outono com emissões dedicadas à diáspora
DATA: 02 de Outubro, 2026
RESUMO: A rádio lança novas rubricas e ligações em direto com emigrantes de Amarante espalhados pela Europa e pelo mundo.
CONTEUDO: Com a chegada do mês de outubro, a Web Rádio Figueiró intensifica a sua grelha com programas especiais que unem as famílias de Figueiró aos conterrâneos residentes em França, Suíça, Alemanha e nas Américas.\n\nAs novas emissões incluem dedicatórias em tempo real, partilha de memórias e os maiores êxitos da música portuguesa e popular.\n\nA direção da rádio agradece a fidelidade de todos os ouvintes que sintonizam a nossa emissão em Alta Definição.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: BECA Handball Debuts Senior Women's Team for the 2026/27 Season
DATA: Today
RESUMO: The sports club based in the Tâmega region launches a major milestone promoting women's sports across municipal parishes.
CONTEUDO: The sports community across Amarante and Baixo Tâmega celebrates the debut of the senior women's handball team by BECA (Bastinhos Escola Clube de Andebol) for the official 2026/27 season.\n\nLocal sporting officials highlighted the enthusiasm and dedication of the young athletes representing regional colors on the national stage.\n\nWeb Rádio Figueiró will follow the team's upcoming matches and scores with weekly broadcasts dedicated to regional sports.
IMAGEM: https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Autumn Along the Tâmega: Grape Harvest Completed with Outstanding Vinho Verde Quality
DATA: Yesterday
RESUMO: Wine estates and local growers in Figueiró and Amarante celebrate exceptional acidity and aroma balance in this year's harvest.
CONTEUDO: Vineyards across the parish of Figueiró and the Tâmega valley have concluded the traditional grape harvest. Supported by sunny autumn afternoons and cool nights, native grape varieties such as Azal, Avesso, and Pedernã reached optimal balance.\n\nLocal families and diaspora visitors joined in the time-honored tradition of manual harvesting, bringing vibrant community spirit to wine cellars.\n\nWinemakers anticipate that the 2026 vintage will stand out for its freshness and distinct regional terroir.
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together
DATA: October 04, 2026
RESUMO: Cultural initiatives, exhibitions, and musical gatherings honor Portuguese cinema and arts in Amarante and Baião.
CONTEUDO: The autumn cultural calendar has begun across the Tâmega region, uniting local schools, artists, and families around open-air exhibitions, author talks, and music performances.\n\nHistorical spaces along the Tâmega River and community centers host sessions celebrating Portuguese literature and classic cinema.\n\nWeb Rádio Figueiró invites listeners across the globe to tune into daily cultural previews and event highlights.
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Expands Autumn Live Shows for the Portuguese Diaspora
DATA: October 02, 2026
RESUMO: The radio station refreshes its broadcast schedule with new community shows and enhanced regional coverage.
CONTEUDO: Web Rádio Figueiró has launched an updated autumn programming schedule, strengthening bonds between residents in Amarante and thousands of Portuguese emigrants in France, Switzerland, Germany, and the Americas.\n\nNew interactive segments allow listeners to send live audio messages, share family memories, and request timeless regional classics.\n\nThe station's management expresses sincere gratitude to all listeners tuned into our crystal-clear HD broadcast worldwide.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

export const fetchDetailedNews = async (lang: Language = 'pt') => {
  const cacheKey = `detailed_news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data as { text: string; source: 'LIVE' | 'LOCAL'; items?: any[] };
  }

  try {
    const res = await fetch(`/api/news?lang=${lang}`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      if (json && json.items && json.items.length > 0) {
        const textBlocks = json.items.map((item: any) => `
NOTICIA_START
TITULO: ${item.title}
DATA: ${item.date}
RESUMO: ${item.excerpt}
CONTEUDO: ${item.content}
IMAGEM: ${item.image}
NOTICIA_END
`).join('\n');

        const result = {
          text: textBlocks,
          source: (json.source === 'LIVE_FEED' ? 'LIVE' : 'LOCAL') as 'LIVE' | 'LOCAL',
          items: json.items
        };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    }
  } catch (err) {
    console.warn("fetchDetailedNews /api/news failed, using local news snapshot:", err);
  }

  const fallbackStr = lang === 'pt' ? FALLBACK_DETAILED_NEWS_PT_STR : FALLBACK_DETAILED_NEWS_EN_STR;
  return { text: fallbackStr, source: 'LOCAL' as const };
};

export const getRadioAssistantResponse = async (userPrompt: string, lang: Language = 'pt'): Promise<string> => {
  const res = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt, lang }),
    signal: AbortSignal.timeout(20000),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error || `Assistant server error (${res.status})`);
  }

  if (!json || typeof json.text !== 'string' || json.text.trim().length === 0) {
    throw new Error('Empty assistant response from server.');
  }

  return json.text;
};
