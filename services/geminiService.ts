
import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

// Simple in-memory cache to avoid redundant API calls and respect rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper to get the AI instance. Creates a new instance before each call as per guidelines.
const getAIInstance = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
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
  if (!ai) return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };

  const model = 'gemini-3-flash-preview';
  const prompt = `Lista 5 notícias ou curiosidades curtas sobre Amarante, Portugal. Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : lang === 'en' ? 'Inglês' : lang === 'es' ? 'Espanhol' : 'Francês'}. Apenas os títulos, um por linha.`;

  try {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional."
        },
      });
      if (response && response.text) {
        const result = { text: response.text, source: 'LIVE' as const, grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    } catch (e: any) {
      // Check for quota error
      if (e?.status === 'RESOURCE_EXHAUSTED' || e?.message?.includes('quota')) {
        console.warn("Gemini Quota Exceeded. Using fallback data.");
        return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };
      }
      console.warn("News grounding failed, falling back to basic generation.", e);
    }
    
    const fallbackResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { systemInstruction: "És o animador da Web Rádio Figueiró." }
    });
    const result = { text: fallbackResponse.text || FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: any) {
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('quota')) {
      console.warn("Gemini Quota Exceeded (Global).");
    } else {
      console.error("fetchLatestNews error:", error);
    }
    return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };
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
  } catch (error: any) {
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('quota')) {
      return "Desculpe, atingi o limite de respostas por agora. Tente novamente mais tarde.";
    }
    console.error("getRadioAssistantResponse error:", error);
    return "Error.";
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

EVENTO_START
TITULO: Cinema ao Ar Livre
DATA: Sextas-feiras, 21:30
LOCAL: Claustros do Convento, Amarante
TIPO: GERAL
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Feira de Artesanato
DATA: Último Domingo do Mês
LOCAL: Largo de S. Gonçalo, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END
`;

export const fetchCulturalEvents = async () => {
  const cacheKey = 'cultural_events';
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return { text: FALLBACK_CULTURAL_DATA };
  }

  const ai = new GoogleGenAI({ apiKey: key });
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

  try {
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
  } catch (error: any) {
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('quota')) {
      console.warn("Gemini Quota Exceeded for Cultural Events.");
      return { text: FALLBACK_CULTURAL_DATA };
    }
    console.error("Error fetching cultural events:", error);
    return { text: FALLBACK_CULTURAL_DATA };
  }
};
