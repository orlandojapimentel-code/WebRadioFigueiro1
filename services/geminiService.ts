
import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

// Simple in-memory cache to avoid redundant API calls and respect rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getAIInstance = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'undefined' || key === 'null' || key === '') {
    console.warn("Gemini API Key is not configured correctly.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

const FALLBACK_NEWS_PT_DATA = [
  "Festas de São Bartolomeu em Amarante Prometem Animar o Mês de Agosto",
  "Figueiró Recebe Festas em Honra de Nossa Senhora do Moreira em Agosto",
  "Noite Branca de Amarante Ilumina o Centro Histórico no Final de Agosto",
  "Web Rádio Figueiró Bate Recordes de Audiência com a Nova Aplicação",
  "Concertos de Verão à Beira do Rio Tâmega Continuam em Agosto"
].join('\n');

const FALLBACK_NEWS_EN_DATA = [
  "São Bartolomeu Festivities in Amarante Set to Highlight August Celebrations",
  "Figueiró Hosts Annual Nossa Senhora do Moreira Festivities in August",
  "Amarante White Night to Illuminate Historic Center in Late August",
  "Web Rádio Figueiró Reaches Record Audience with New Mobile App",
  "Summer Concerts by the Tâmega River Continue Throughout August"
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
    const model = 'gemini-3-flash-preview';
    const prompt = `Lista 5 notícias ou curiosidades curtas mais recentes sobre Amarante e Figueiró, Portugal (Agosto de 2026). Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}. Apenas os títulos, um por linha.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional."
      },
    });

    const result = { text: response.text || fallbackData, source: 'LIVE' as const };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: any) {
    console.error("fetchLatestNews client error:", error);
    return { text: fallbackData, source: 'LOCAL' as const };
  }
};

const FALLBACK_CULTURAL_DATA = `
EVENTO_START
TITULO: Festas de São Bartolomeu
DATA: 20 a 24 de Agosto
LOCAL: Largo de São Gonçalo, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Festa de N. Senhora do Moreira
DATA: 14 a 16 de Agosto
LOCAL: Figueiró, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Noite Branca de Amarante
DATA: 29 de Agosto
LOCAL: Centro Histórico, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Concertos de Verão no Rio Tâmega
DATA: Todos os Sábados de Agosto
LOCAL: Parque Ribeirinho, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800
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
    const model = 'gemini-3-flash-preview';
    const prompt = `Procura eventos culturais reais, concertos, exposições, teatro ou festas populares em Amarante e Figueiró, Portugal para este mês de Agosto e próximas semanas de 2026. 
    Retorna uma lista de eventos formatada rigorosamente usando os blocos abaixo para cada evento:

    EVENTO_START
    TITULO: [Nome do Evento]
    DATA: [Dia e Mês, ex: 20 de Agosto]
    LOCAL: [Local exato em Amarante ou Figueiró]
    TIPO: [Escolhe uma categoria: CONCERTO, EXPOSIÇÃO, TEATRO, FESTA ou GERAL]
    IMAGEM: [URL de uma imagem do cartaz ou local se encontrada]
    LINK: [URL para mais informações]
    EVENTO_END

    Inclui pelo menos 4 eventos se possível.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o curador da agenda cultural da Web Rádio Figueiró. A tua missão é encontrar eventos reais e atuais em Amarante e Figueiró, Portugal."
      },
    });

    const result = { text: response.text || FALLBACK_CULTURAL_DATA };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("Error fetching cultural events client:", error);
    return { text: FALLBACK_CULTURAL_DATA };
  }
};

const FALLBACK_DETAILED_NEWS_PT_STR = `
NOTICIA_START
TITULO: Festas de São Bartolomeu em Amarante Prometem Animar o Mês de Agosto
DATA: 05 Agosto, 2026
RESUMO: As tradicionais Festas de São Bartolomeu regressam ao centro histórico com concertos, folclore e fogo de artifício no Tâmega.
CONTEUDO: O concelho de Amarante prepara-se para acolher uma das suas celebrações mais emblemáticas do verão: as Festas de São Bartolomeu. Durante cinco dias, o centro histórico transforma-se num palco vibrante de cultura, música popular e convívio comunitário.\\n\\nA programação inclui atuações de bandas filarmónicas, ranchos folclóricos da região — com destaque para as tradições de Figueiró —, concertos de artistas nacionais e o majestoso espetáculo piromusical sobre as águas do rio Tâmega.\\n\\nA Web Rádio Figueiró fará a cobertura completa em direto, levando o ambiente festivo aos ouvintes no concelho e na diáspora.
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Figueiró Recebe Festas em Honra de Nossa Senhora do Moreira
DATA: 03 Agosto, 2026
RESUMO: A freguesia de Figueiró celebra as suas festividades anuais com grande fervor religioso e animação musical para toda a família.
CONTEUDO: A freguesia de Figueiró acolhe já em meados de agosto a tradicional Festa em Honra de Nossa Senhora do Moreira, um dos momentos mais aguardados do ano pela população local e pelos emigrantes que regressam à sua terra natal nas férias de verão.\\n\\nO programa festivo combina a vertente religiosa — com a procissão solene pelas ruas da freguesia — com a vertente profana, destacando-se espetáculos de variedades, jogos tradicionais e o encontro de concertinas.\\n\\nA comissão de festas apela à participação de todos neste grande reencontro da comunidade de Figueiró.
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Noite Branca de Amarante Ilumina o Centro Histórico no Final de Agosto
DATA: 01 Agosto, 2026
RESUMO: O evento multicultural promete transformar as margens do Tâmega num mar de luz, música, teatro de rua e gastronomia.
CONTEUDO: O centro histórico de Amarante vai voltar a vestir-se integralmente de branco para a grande Noite Branca. O evento, que atrai milhares de visitantes, contará com múltiplos palcos espalhados pelas praças e pontes da cidade, com DJs, bandas ao vivo e performance de artes de rua.\\n\\nComércio tradicional e restaurantes estarão abertos pela noite dentro com menus especiais inspirados nos sabores da região, como o vinho verde e a doçaria conventual.\\n\\nA Web Rádio Figueiró montará um estúdio de rádio em direto no recinto para acompanhar em tempo real toda a animação.
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Bate Recordes de Audiência com a Nova Aplicação
DATA: 28 Julho, 2026
RESUMO: O lançamento da app com emissão HD e inteligência artificial atrai milhares de novos ouvintes da comunidade emigrante.
CONTEUDO: A Web Rádio Figueiró consolida a sua posição como a voz de referência da região de Amarante e Figueiró no ecossistema digital. Um mês após o lançamento oficial da sua nova aplicação mobile, os indicadores de audiência revelam um crescimento sem precedentes, sobretudo junto das comunidades portuguesas na Europa e América.\\n\\nA funcionalidade do assistente IA para pedidos musicais e a transmissão em alta definição (HD) têm sido amplamente elogiadas pelos ouvintes.\\n\\nA direção da rádio agradece a confiança e promete continuar a reforçar os conteúdos informativos e culturais.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: São Bartolomeu Festivities in Amarante Set to Highlight August Celebrations
DATA: August 05, 2026
RESUMO: The traditional Festas de São Bartolomeu return to the historic center with concerts, folklore, and fireworks over the Tâmega River.
CONTEUDO: The municipality of Amarante is preparing to host one of its most iconic summer celebrations: the Festas de São Bartolomeu. For five days, the historic center will transform into a vibrant stage for culture, traditional music, and community gathering.\\n\\nThe line-up features performances by brass bands, local folklore groups — highlighting the traditions of Figueiró —, concerts by national artists, and a magnificent musical fireworks display over the Tâmega River.\\n\\nWeb Rádio Figueiró will provide full live coverage, bringing the festive spirit to listeners locally and across the diaspora.
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Figueiró Hosts Annual Nossa Senhora do Moreira Festivities
DATA: August 03, 2026
RESUMO: The parish of Figueiró celebrates its annual festivities with great religious devotion and live entertainment for the whole family.
CONTEUDO: The parish of Figueiró welcomes in mid-August the traditional Feast in Honor of Nossa Senhora do Moreira, one of the most anticipated moments of the year for residents and returning emigrants on summer vacation.\\n\\nThe festive schedule combines religious traditions — including the solemn procession through the parish streets — with lively entertainment, feature shows, traditional games, and folk music gatherings.\\n\\nThe committee invites the entire community to join in this joyful reunion in Figueiró.
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Amarante White Night to Illuminate Historic Center in Late August
DATA: August 01, 2026
RESUMO: The multicultural event promises to turn the Tâmega riverbanks into a sea of light, live music, street theater, and gastronomy.
CONTEUDO: The historic heart of Amarante will once again dress entirely in white for the famous White Night. Attracting thousands of visitors, the event will feature multiple stages across city squares and bridges, with DJs, live bands, and street performances.\\n\\nLocal shops and restaurants will stay open throughout the night offering regional wine and traditional pastries.\\n\\nWeb Rádio Figueiró will broadcast live from the venue to bring real-time updates and interviews to its listeners.
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Reaches Record Audience with New Mobile App
DATA: July 28, 2026
RESUMO: The launch of the app with HD audio and AI assistant attracts thousands of new listeners across the emigrant community.
CONTEUDO: Web Rádio Figueiró reinforces its position as the voice of reference for Amarante and Figueiró in the digital landscape. One month after launching its official mobile application, audience figures show unprecedented growth, particularly among Portuguese diaspora communities in Europe and the Americas.\\n\\nFeatures like the AI assistant for music requests and high-definition audio streaming have received widespread praise from listeners.\\n\\nRadio management thanks all supporters and commits to expanding regional news and cultural coverage.
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
    const model = 'gemini-3-flash-preview';
    const prompt = `Procura as 4 notícias mais recentes e relevantes de Amarante e Figueiró, Portugal para este mês de Agosto de 2026. 
    Para cada notícia, gera um bloco estruturado como o seguinte:

    NOTICIA_START
    TITULO: [Título Curto e Impactante]
    DATA: [Dia e Mês atualizado, ex: 05 de Agosto, 2026]
    RESUMO: [Um parágrafo curto de introdução]
    CONTEUDO: [Texto detalhado da notícia com pelo menos 3 parágrafos]
    IMAGEM: [URL do Unsplash que corresponda exatamente ao assunto (deve começar por https://images.unsplash.com/photo-), OU deixa este campo vazio se não tiveres certeza, para que a rádio atribua uma imagem selecionada à mão automaticamente]
    NOTICIA_END

    AVISO IMPORTANTE: Nunca uses caminhos ou domínios de jornais locais ou nacionais (como jn.pt, sapo.pt, publico.pt) pois são bloqueados no navegador do utilizador por motivos de segurança e deixam de carregar. Usa apenas o Unsplash ou deixa vazio.

    Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o jornalista principal da Web Rádio Figueiró. A tua missão é trazer as novidades mais frescas de Amarante e Figueiró com rigor e profissionalismo."
      },
    });

    const result = { text: response.text || fallbackStr, source: 'LIVE' as const };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("fetchDetailedNews client error:", error);
    return { text: fallbackStr, source: 'LOCAL' as const };
  }
};

export const getRadioAssistantResponse = async (userPrompt: string, lang: Language = 'pt'): Promise<string> => {
  const ai = getAIInstance();
  if (!ai) return "Offline.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `És a assistente virtual da Web Rádio Figueiró. Responde sempre no idioma: ${lang}. Sê simpática e prestativa.`,
        tools: [{ googleSearch: {} }]
      },
    });
    return response.text || "Error.";
  } catch (error) {
    console.error("getRadioAssistantResponse error:", error);
    return "Error.";
  }
};
