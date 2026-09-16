
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
  "Vindimas em Amarante e Figueiró Anteveem Vinho Verde de Excelente Qualidade",
  "Amarante Celebra Jornadas Europeias do Património com Roteiros e Música no Tâmega",
  "Cineteatro de Amarante Apresenta Temporada Cultural de Outono com Grandes Espetáculos",
  "Web Rádio Figueiró Estreia Grelha de Outono com Novos Programas Dedicados à Diáspora",
  "Feiras Tradicionais e Encontros de Concertinas Animam o Concelho em Setembro"
].join('\n');

const FALLBACK_NEWS_EN_DATA = [
  "Wine Harvest in Amarante and Figueiró Anticipates Outstanding Vinho Verde",
  "Amarante Celebrates European Heritage Days with Guided Routes and Music by the Tâmega",
  "Amarante Cine-Theater Announces Autumn Season Featuring Fado, Theater, and Cinema",
  "Web Rádio Figueiró Debuts Autumn Programming Dedicated to the Global Diaspora",
  "Traditional Fairs and Accordion Gatherings Bring Music to Municipal Parishes"
].join('\n');

export const fetchLatestNews = async (lang: Language = 'pt') => {
  const cacheKey = `news_${lang}`;
  const now = Date.now();

  const fallbackData = lang === 'pt' ? FALLBACK_NEWS_PT_DATA : FALLBACK_NEWS_EN_DATA;

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  if (!ai) return { text: fallbackData, source: 'LOCAL' as const };

  try {
    const prompt = `Lista 5 notícias ou curiosidades curtas mais recentes sobre Amarante e Figueiró, Portugal (Setembro de 2026). Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}. Apenas os títulos, um por linha.`;
    const sys = "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional.";

    const text = await callGeminiContent(ai, prompt, sys);
    const result = { text: text || fallbackData, source: text ? ('LIVE' as const) : ('LOCAL' as const) };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: unknown) {
    console.warn("fetchLatestNews using fallback:", error instanceof Error ? error.message : String(error));
    return { text: fallbackData, source: 'LOCAL' as const };
  }
};

const FALLBACK_CULTURAL_DATA = `
EVENTO_START
TITULO: Jornadas Europeias do Património: Rota dos Moinhos de Figueiró
DATA: 25 a 27 de Setembro
LOCAL: Figueiró, Amarante
TIPO: EXPOSIÇÃO
IMAGEM: https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Festa das Vindimas e Sabores de Amarante
DATA: 26 e 27 de Setembro
LOCAL: Centro Histórico, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Noite de Fado e Poesia de Teixeira de Pascoaes
DATA: 03 de Outubro
LOCAL: Claustros de São Gonçalo, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Abertura da Temporada Cultural de Outono
DATA: 10 de Outubro
LOCAL: Cineteatro de Amarante
TIPO: TEATRO
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Exposição Amadeo de Souza-Cardoso
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
TITULO: Vindimas em Amarante e Figueiró Anteveem Vinho Verde de Excelente Qualidade
DATA: 16 Setembro, 2026
RESUMO: A época das vindimas arrancou em força nas encostas do Tâmega e socalcos de Figueiró, com viticultores a prever colheita excecional.
CONTEUDO: As quintas e vinhedos da sub-região de Amarante e da freguesia de Figueiró iniciaram a tradicional azáfama das vindimas de outono. Favorecidas por um verão de noites frescas e dias de sol ameno, as castas autóctones como Azal, Avesso e Pedernã apresentam uma maturação perfeita e equilíbrio de acidez ímpar.\\n\\nNa freguesia de Figueiró, pequenos e médios produtores preservam a colheita manual e a pisa tradicional em lagares de granito. A época traz também de volta o convívio nas adegas, juntando vizinhos e familiares da diáspora que prolongaram a estadia para participar nesta tradição secular.\\n\\nA Web Rádio Figueiró acompanhará ao longo de setembro as histórias dos nossos viticultores, com transmissões dedicadas aos aromas e saberes do nosso Vinho Verde.
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Amarante Celebra Jornadas Europeias do Património com Roteiros e Música no Tâmega
DATA: 14 Setembro, 2026
RESUMO: Monumentos históricos, pontes seculares e trilhos naturais de Figueiró abrem portas com visitas guiadas e concertos gratuitos no final de setembro.
CONTEUDO: De 25 a 27 de setembro, o concelho de Amarante assinala as Jornadas Europeias do Património com uma vasta programação cultural e de descoberta do património construído e imaterial. O programa integra percursos temáticos pelas margens do rio Tâmega e visitas noturnas ao Mosteiro de São Gonçalo.\\n\\nA freguesia de Figueiró estará em destaque com um percurso pedestre guiado pelos antigos moinhos de água e capelas históricas, convidando os participantes a redescobrir as lendas, ofícios ancestrais e a arquitetura rural da nossa terra.\\n\\nTodas as atividades são gratuitas e destinadas a famílias, amantes da natureza e a todos os que valorizam a identidade cultural da nossa região.
IMAGEM: https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Cineteatro de Amarante Apresenta Temporada Cultural de Outono com Grandes Espetáculos
DATA: 11 Setembro, 2026
RESUMO: A nova programação arranca este mês trazendo fado contemporâneo, teatro nacional e sessões de cinema de autor ao coração da cidade.
CONTEUDO: O Cineteatro de Amarante divulgou a sua ambiciosa programação cultural para os meses de outono. A nova temporada abre com grandes nomes da música portuguesa, ciclos de teatro comunitário e concertos intimistas de fado e guitarras clássicas.\\n\\nAs associações culturais de Figueiró e das freguesias vizinhas marcarão presença em mostras de artes cénicas e encontros musicais, promovendo jovens talentos e tradições orais.\\n\\nOs ouvintes da Web Rádio Figueiró poderão acompanhar antevisões exclusivas e entrevistas com os artistas convidados na nossa emissão diária.
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Estreia Grelha de Outono com Novos Programas Dedicados à Diáspora
DATA: 08 Setembro, 2026
RESUMO: A estação renova a emissão com a rubrica 'Pontes de Saudade' e reforça a transmissão em direto de eventos culturais locais.
CONTEUDO: Com a chegada do outono, a Web Rádio Figueiró lança uma grelha de programação renovada, reforçando a ligação com a comunidade de ouvintes locais e com os milhares de portugueses no estrangeiro. Entre as estreias destaca-se o programa semanal 'Pontes de Saudade', que conecta famílias de Figueiró a familiares residentes em França, Suíça e nas Américas.\\n\\nA grelha inclui ainda reportagens matinais sobre a vida associativa de Amarante, informação meteorológica rural e os grandes clássicos da música popular e ligeira portuguesa.\\n\\nA direção da rádio agradece o apoio contínuo de todos os ouvintes que acompanham a emissão diária em Alta Definição através da nossa plataforma.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: Grape Harvest in Amarante and Figueiró Anticipates Outstanding Vinho Verde
DATA: September 16, 2026
RESUMO: The harvest season kicks off across Tâmega slopes and Figueiró vineyards, with winemakers forecasting high-quality wine.
CONTEUDO: Wineries and vineyard estates across the Amarante sub-region and the parish of Figueiró have launched the traditional autumn harvest. Thanks to a summer with crisp nights and mild sunny days, indigenous grape varieties including Azal, Avesso, and Pedernã boast optimal ripeness and vibrant acidity.\\n\\nIn Figueiró, local growers maintain manual harvesting and granite stone pressing traditions. The harvest brings renewed community warmth to the wine cellars, joining neighbors and diaspora families enjoying the season.\\n\\nWeb Rádio Figueiró will cover local stories, harvest customs, and the authentic winemaking heritage of our region throughout September.
IMAGEM: https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Amarante Celebrates European Heritage Days with Guided Routes and Music by the Tâmega
DATA: September 14, 2026
RESUMO: Historic landmarks, scenic bridges, and heritage trails in Figueiró welcome visitors with free guided tours in late September.
CONTEUDO: From September 25 to 27, the municipality of Amarante celebrates European Heritage Days with open-air events, cultural trails, and musical showcases along the scenic Tâmega River.\\n\\nThe parish of Figueiró will be in the spotlight with an interpretive walking trail through historic watermills and chapels, inviting participants to explore centuries of local folklore, stone masonry, and pastoral traditions.\\n\\nAll activities are free and designed for families, nature lovers, and cultural heritage enthusiasts.
IMAGEM: https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Amarante Cine-Theater Announces Autumn Season Featuring Fado, Theater, and Cinema
DATA: September 11, 2026
RESUMO: The new cultural lineup launches this month, bringing acclaimed Portuguese artists and community productions to the city.
CONTEUDO: The Amarante Cine-Theater has unveiled its rich cultural programme for the autumn months. Highlights include intimate fado concerts, award-winning contemporary drama, and independent film screenings followed by audience discussions.\\n\\nLocal associations from Figueiró and surrounding parishes will present community performances, showcasing regional talent and living memories.\\n\\nWeb Rádio Figueiró listeners can tune in for exclusive previews and artist interviews on our daily broadcast.
IMAGEM: https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Debuts Autumn Programming Dedicated to the Global Diaspora
DATA: September 08, 2026
RESUMO: The radio station refreshes its broadcast schedule with new community shows and enhanced regional coverage.
CONTEUDO: With autumn underway, Web Rádio Figueiró has premiered an updated programming lineup designed to bridge local communities and emigrants abroad. The flagship addition is the weekly live show 'Bridges of Saudade', connecting residents in Figueiró with relatives living in France, Switzerland, and the Americas.\\n\\nThe schedule also includes daily morning reports on local agricultural life, weather forecasts, and timeless Portuguese classics.\\n\\nThe management expresses sincere appreciation to all listeners tuning into our crystal-clear HD broadcast worldwide.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

export const fetchDetailedNews = async (lang: Language = 'pt') => {
  const cacheKey = `detailed_news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  const fallbackStr = lang === 'pt' ? FALLBACK_DETAILED_NEWS_PT_STR : FALLBACK_DETAILED_NEWS_EN_STR;
  if (!ai) return { text: fallbackStr, source: 'LOCAL' as const };

  try {
    const prompt = `Procura as 4 notícias mais recentes e relevantes de Amarante e Figueiró, Portugal para este mês de Setembro de 2026. 
    Para cada notícia, gera um bloco estruturado como o seguinte:

    NOTICIA_START
    TITULO: [Título Curto e Impactante]
    DATA: [Dia e Mês atualizado, ex: 16 de Setembro, 2026]
    RESUMO: [Um parágrafo curto de introdução]
    CONTEUDO: [Texto detalhado da notícia com pelo menos 3 parágrafos]
    IMAGEM: [URL do Unsplash que corresponda exatamente ao assunto (deve começar por https://images.unsplash.com/photo-), OU deixa este campo vazio se não tiveres certeza, para que a rádio atribua uma imagem selecionada à mão automaticamente]
    NOTICIA_END

    AVISO IMPORTANTE: Nunca uses caminhos ou domínios de jornais locais ou nacionais (como jn.pt, sapo.pt, publico.pt) pois são bloqueados no navegador do utilizador por motivos de segurança e deixam de carregar. Usa apenas o Unsplash ou deixa vazio.

    Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}.`;
    const sys = "És o jornalista principal da Web Rádio Figueiró. A tua missão é trazer as novidades mais frescas de Amarante e Figueiró com rigor e profissionalismo.";

    const text = await callGeminiContent(ai, prompt, sys);
    const result = { text: text || fallbackStr, source: text ? ('LIVE' as const) : ('LOCAL' as const) };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: unknown) {
    console.warn("fetchDetailedNews using fallback:", error instanceof Error ? error.message : String(error));
    return { text: fallbackStr, source: 'LOCAL' as const };
  }
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
