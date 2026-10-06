
import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

// Simple in-memory cache to avoid redundant API calls and respect rate limits
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getAIInstance = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'undefined' || key === 'null' || key === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

// Helper to call Gemini models with resilient fallback and without restricted tools
const callGeminiContent = async (
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string
): Promise<string | null> => {
  const candidateModels = ['gemini-3-flash-preview', 'gemini-flash-latest'];
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      if (response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: unknown) {
      console.warn(`Gemini (${model}) unavailable or restricted:`, err instanceof Error ? err.message : String(err));
    }
  }
  return null;
};

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

  // 1. Try Live Serverless / Dev API
  try {
    const res = await fetch(`/api/news?lang=${lang}`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      if (json && json.items && json.items.length > 0) {
        const text = json.items.map((it: any) => it.title).join('\n');
        const result = { text, source: 'LIVE' as const, items: json.items };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    }
  } catch (err) {
    console.warn("fetchLatestNews /api/news failed, checking fallback:", err);
  }

  // 2. Try Gemini AI if available
  const ai = getAIInstance();
  if (ai) {
    try {
      const prompt = `Lista 5 notícias ou curiosidades curtas mais recentes sobre Amarante e Figueiró, Portugal (Outono de 2026). Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}. Apenas os títulos, um por linha.`;
      const sys = "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional.";
      const text = await callGeminiContent(ai, prompt, sys);
      if (text) {
        const result = { text, source: 'LIVE' as const };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    } catch (error: unknown) {
      console.warn("fetchLatestNews using fallback:", error instanceof Error ? error.message : String(error));
    }
  }

  const fallbackData = lang === 'pt' ? FALLBACK_NEWS_PT_DATA : FALLBACK_NEWS_EN_DATA;
  return { text: fallbackData, source: 'LOCAL' as const };
};

const FALLBACK_CULTURAL_DATA = `
EVENTO_START
TITULO: Roteiro dos Moinhos de Água e Capelas Históricas de Figueiró
DATA: 10 a 12 de Outubro
LOCAL: Figueiró, Amarante
TIPO: EXPOSIÇÃO
IMAGEM: https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Encontros de Outono e Sabores Tradicionais do Tâmega
DATA: 17 e 18 de Outubro
LOCAL: Centro Histórico, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Noite de Fado e Poesia de Teixeira de Pascoaes
DATA: 24 de Outubro
LOCAL: Claustros de São Gonçalo, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Temporada de Outono do Cineteatro de Amarante
DATA: Todo o Mês
LOCAL: Cineteatro de Amarante
TIPO: TEATRO
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Exposição Permanente Amadeo de Souza-Cardoso
DATA: Permanente
LOCAL: Museu Municipal, Amarante
TIPO: EXPOSIÇÃO
IMAGEM: https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END
`;

export const fetchCulturalEvents = async () => {
  const cacheKey = 'cultural_events';
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  if (!ai) return { text: FALLBACK_CULTURAL_DATA };

  try {
    const prompt = `Procura eventos culturais reais, concertos, exposições, teatro ou festas populares em Amarante e Figueiró, Portugal para este mês de Setembro e Outono de 2026. 
    Retorna uma lista de eventos formatada rigorosamente usando os blocos abaixo para cada evento:

    EVENTO_START
    TITULO: [Nome do Evento]
    DATA: [Dia e Mês, ex: 26 de Setembro]
    LOCAL: [Local exato em Amarante ou Figueiró]
    TIPO: [Escolhe uma categoria: CONCERTO, EXPOSIÇÃO, TEATRO, FESTA ou GERAL]
    IMAGEM: [URL de uma imagem do cartaz ou local se encontrada]
    LINK: [URL para mais informações]
    EVENTO_END

    Inclui pelo menos 4 eventos se possível.`;
    const sys = "És o curador da agenda cultural da Web Rádio Figueiró. A tua missão é encontrar eventos reais e atuais em Amarante e Figueiró, Portugal.";

    const text = await callGeminiContent(ai, prompt, sys);
    const result = { text: text || FALLBACK_CULTURAL_DATA };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: unknown) {
    console.warn("fetchCulturalEvents using fallback:", error instanceof Error ? error.message : String(error));
    return { text: FALLBACK_CULTURAL_DATA };
  }
};

const FALLBACK_DETAILED_NEWS_PT_STR = `
NOTICIA_START
TITULO: BECA estreia equipa sénior feminina na época 2026/27 no Baixo Tâmega
DATA: Hoje
RESUMO: O clube da região do Tâmega assinala um momento histórico no andebol regional, reforçando o desporto feminino e a formação jovem.
CONTEUDO: A comunidade desportiva de Amarante e da região do Baixo Tâmega celebra a estreia oficial da equipa sénior feminina do BECA (Bastinhos Escola Clube de Andebol) para a temporada 2026/27.\\n\\nDirigentes e atletas sublinharam o entusiasmo em representar as cores da nossa terra nas competições oficiais, contando com o apoio caloroso das famílias e adeptos locais.\\n\\nA Web Rádio Figueiró acompanhará a evolução dos resultados e o calendário dos jogos nas nossas emissões diárias de desporto.
IMAGEM: https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Outono em Figueiró: Vindimas concluídas com Vinho Verde de excelente qualidade
DATA: Ontem
RESUMO: Viticultores e quintas de Figueiró e Amarante celebram uma colheita com perfeito equilíbrio de aromas e frescura nas encostas do Tâmega.
CONTEUDO: As quintas e vinhedos da freguesia de Figueiró e do vale do Tâmega concluíram com sucesso a tradicional faina das vindimas de outono. Favorecidas por semanas de sol ameno e noites frescas, as castas regionais como Azal, Avesso e Pedernã apresentaram uma maturação equilibrada.\\n\\nA época juntou mais uma vez produtores locais e familiares da diáspora que aproveitaram a estadia para manter viva a tradição da colheita manual e da pisa tradicional em lagares de granito.\\n\\nOs enólogos e produtores anteveem vinhos de grande frescura e tipicidade única na colheita deste ano.
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Cultura no Tâmega: Cinema, literatura e encontros de outono aproximam as comunidades
DATA: 04 de Outubro, 2026
RESUMO: Eventos culturais e mostras artísticas dinamizam Amarante e o Tâmega com iniciativas dedicadas aos jovens e ao património local.
CONTEUDO: A programação cultural de outono na região do Tâmega arrancou com iniciativas que combinam sessões de cinema, encontros com autores e espetáculos musicais ao ar livre.\\n\\nEspaços históricos de Amarante e das freguesias vizinhas abrem as portas a visitas guiadas e tertúlias sobre as tradições orais e o património construído.\\n\\nA Web Rádio Figueiró continua a divulgar a agenda dos eventos para que nenhum ouvinte perca os principais destaques da nossa terra.
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró reforça programação de outono com emissões dedicadas à diáspora
DATA: 02 de Outubro, 2026
RESUMO: A rádio lança novas rubricas e ligações em direto com emigrantes de Amarante espalhados pela Europa e pelo mundo.
CONTEUDO: Com a chegada do mês de outubro, a Web Rádio Figueiró intensifica a sua grelha com programas especiais que unem as famílias de Figueiró aos conterrâneos residentes em França, Suíça, Alemanha e nas Américas.\\n\\nAs novas emissões incluem dedicatórias em tempo real, partilha de memórias e os maiores êxitos da música portuguesa e popular.\\n\\nA direção da rádio agradece a fidelidade de todos os ouvintes que sintonizam a nossa emissão em Alta Definição.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: BECA Handball Debuts Senior Women's Team for the 2026/27 Season
DATA: Today
RESUMO: The sports club based in the Tâmega region launches a major milestone promoting women's sports across municipal parishes.
CONTEUDO: The sports community across Amarante and Baixo Tâmega celebrates the debut of the senior women's handball team by BECA (Bastinhos Escola Clube de Andebol) for the official 2026/27 season.\\n\\nLocal sporting officials highlighted the enthusiasm and dedication of the young athletes representing regional colors on the national stage.\\n\\nWeb Rádio Figueiró will follow the team's upcoming matches and scores with weekly broadcasts dedicated to regional sports.
IMAGEM: https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Autumn Along the Tâmega: Grape Harvest Completed with Outstanding Vinho Verde Quality
DATA: Yesterday
RESUMO: Wine estates and local growers in Figueiró and Amarante celebrate exceptional acidity and aroma balance in this year's harvest.
CONTEUDO: Vineyards across the parish of Figueiró and the Tâmega valley have concluded the traditional grape harvest. Supported by sunny autumn afternoons and cool nights, native grape varieties such as Azal, Avesso, and Pedernã reached optimal balance.\\n\\nLocal families and diaspora visitors joined in the time-honored tradition of manual harvesting, bringing vibrant community spirit to wine cellars.\\n\\nWinemakers anticipate that the 2026 vintage will stand out for its freshness and distinct regional terroir.
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Tâmega Cultural Autumn: Cinema, Heritage and Literature Bring Communities Together
DATA: October 04, 2026
RESUMO: Cultural initiatives, exhibitions, and musical gatherings honor Portuguese cinema and arts in Amarante and Baião.
CONTEUDO: The autumn cultural calendar has begun across the Tâmega region, uniting local schools, artists, and families around open-air exhibitions, author talks, and music performances.\\n\\nHistorical spaces along the Tâmega River and community centers host sessions celebrating Portuguese literature and classic cinema.\\n\\nWeb Rádio Figueiró invites listeners across the globe to tune into daily cultural previews and event highlights.
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Expands Autumn Live Shows for the Portuguese Diaspora
DATA: October 02, 2026
RESUMO: The radio station refreshes its broadcast schedule with new community shows and enhanced regional coverage.
CONTEUDO: Web Rádio Figueiró has launched an updated autumn programming schedule, strengthening bonds between residents in Amarante and thousands of Portuguese emigrants in France, Switzerland, Germany, and the Americas.\\n\\nNew interactive segments allow listeners to send live audio messages, share family memories, and request timeless regional classics.\\n\\nThe station's management expresses sincere gratitude to all listeners tuned into our crystal-clear HD broadcast worldwide.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

export const fetchDetailedNews = async (lang: Language = 'pt') => {
  const cacheKey = `detailed_news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data as { text: string; source: 'LIVE' | 'LOCAL'; items?: any[] };
  }

  // 1. Try Live Serverless / Dev API
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
    console.warn("fetchDetailedNews /api/news failed, checking fallback:", err);
  }

  // 2. Try Gemini AI if available
  const ai = getAIInstance();
  const fallbackStr = lang === 'pt' ? FALLBACK_DETAILED_NEWS_PT_STR : FALLBACK_DETAILED_NEWS_EN_STR;
  if (ai) {
    try {
      const prompt = `Procura as 4 notícias mais recentes e relevantes de Amarante e Figueiró, Portugal para este mês de Outubro de 2026. 
      Para cada notícia, gera um bloco estruturado como o seguinte:

      NOTICIA_START
      TITULO: [Título Curto e Impactante]
      DATA: [Dia e Mês atualizado, ex: 06 de Outubro, 2026]
      RESUMO: [Um parágrafo curto de introdução]
      CONTEUDO: [Texto detalhado da notícia com pelo menos 3 parágrafos]
      IMAGEM: [URL do Unsplash que corresponda exatamente ao assunto (deve começar por https://images.unsplash.com/photo-), OU deixa este campo vazio se não tiveres certeza, para que a rádio atribua uma imagem selecionada à mão automaticamente]
      NOTICIA_END

      AVISO IMPORTANTE: Nunca uses caminhos ou domínios de jornais locais ou nacionais (como jn.pt, sapo.pt, publico.pt) pois são bloqueados no navegador do utilizador por motivos de segurança e deixam de carregar. Usa apenas o Unsplash ou deixa vazio.

      Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}.`;
      const sys = "És o jornalista principal da Web Rádio Figueiró. A tua missão é trazer as novidades mais frescas de Amarante e Figueiró com rigor e profissionalismo.";

      const text = await callGeminiContent(ai, prompt, sys);
      if (text) {
        const result = { text, source: 'LIVE' as const };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    } catch (error: unknown) {
      console.warn("fetchDetailedNews using fallback:", error instanceof Error ? error.message : String(error));
    }
  }

  const result = { text: fallbackStr, source: 'LOCAL' as const };
  return result;
};

export const getRadioAssistantResponse = async (userPrompt: string, lang: Language = 'pt'): Promise<string> => {
  const ai = getAIInstance();
  if (!ai) return lang === 'pt' ? "Assistente temporariamente indisponível." : "Assistant temporarily unavailable.";

  try {
    const sys = `És a assistente virtual da Web Rádio Figueiró. Responde sempre no idioma: ${lang}. Sê simpática e prestativa.`;
    const text = await callGeminiContent(ai, userPrompt, sys);
    return text || (lang === 'pt' ? "A Web Rádio Figueiró está no ar em Alta Definição!" : "Web Rádio Figueiró is broadcasting live in HD!");
  } catch (error: unknown) {
    console.warn("getRadioAssistantResponse using fallback:", error instanceof Error ? error.message : String(error));
    return lang === 'pt'
      ? "Olá! Estou a ouvir a Web Rádio Figueiró. Em que posso ajudar relativamente à nossa emissão ou músicas?"
      : "Hello! I am listening to Web Rádio Figueiró. How can I assist you with our broadcast or music?";
  }
};
