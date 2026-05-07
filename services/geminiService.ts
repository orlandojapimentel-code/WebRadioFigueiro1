
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

const FALLBACK_NEWS_DATA = [
  "Web Rádio Figueiró: Sintonize a melhor seleção musical de Amarante 24h por dia.",
  "Peça a sua música favorita através do nosso novo Centro de Pedidos digital.",
  "WRF Digital: Tecnologia de ponta e som de alta fidelidade para todos os ouvintes.",
  "Acompanhe as nossas redes sociais para ficar a par de todos os eventos da região.",
  "Web Rádio Figueiró: A elevar a voz de Amarante para o mundo inteiro."
].join('\n');

export const fetchLatestNews = async (lang: Language = 'pt') => {
  const cacheKey = `news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  if (!ai) return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const };

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Lista 5 notícias ou curiosidades curtas sobre Amarante, Portugal. Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}. Apenas os títulos, um por linha.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional."
      },
    });

    const result = { text: response.text || FALLBACK_NEWS_DATA, source: 'LIVE' as const };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: any) {
    console.error("fetchLatestNews client error:", error);
    return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const };
  }
};

const FALLBACK_CULTURAL_DATA = `
EVENTO_START
TITULO: Música no Rio
DATA: Todos os Sábados de Julho
LOCAL: Parque Ribeirinho, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
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
    const prompt = `Procura eventos culturais reais, concertos, exposições, teatro ou festas populares em Amarante, Portugal para as próximas semanas e meses. 
    Retorna uma lista de eventos formatada rigorosamente usando os blocos abaixo para cada evento:

    EVENTO_START
    TITULO: [Nome do Evento]
    DATA: [Dia e Mês, ex: 15 de Julho]
    LOCAL: [Local exato em Amarante]
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
        systemInstruction: "És o curador da agenda cultural da Web Rádio Figueiró. A tua missão é encontrar eventos reais e atuais em Amarante, Portugal."
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

export const fetchDetailedNews = async (lang: Language = 'pt') => {
  const cacheKey = `detailed_news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  if (!ai) return { text: "", source: 'LOCAL' };

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Procura as 4 notícias mais recentes e relevantes de Amarante, Portugal. 
    Para cada notícia, gera um bloco estruturado como o seguinte:

    NOTICIA_START
    TITULO: [Título Curto e Impactante]
    DATA: [Dia e Mês atualizado, ex: 15 de Maio, 2026]
    RESUMO: [Um parágrafo curto de introdução]
    CONTEUDO: [Texto detalhado da notícia com pelo menos 3 parágrafos]
    IMAGEM: [URL de uma imagem real relacionada se encontrada, senão deixa vazio]
    NOTICIA_END

    Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o jornalista principal da Web Rádio Figueiró. A tua missão é trazer as novidades mais frescas de Amarante com rigor e profissionalismo."
      },
    });

    const result = { text: response.text || "", source: 'LIVE' };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("fetchDetailedNews client error:", error);
    return { text: "", source: 'LOCAL' };
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
