
import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

// Helper to get the AI instance. Creates a new instance before each call as per guidelines.
const getAIInstance = () => {
  const key = process.env.API_KEY;
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
  const ai = getAIInstance();
  if (!ai) return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };

  const model = 'gemini-3-flash-preview';
  const prompt = `Lista 5 notícias ou curiosidades curtas sobre Amarante, Portugal. Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : lang === 'en' ? 'Inglês' : lang === 'es' ? 'Espanhol' : 'Francês'}. Apenas os títulos, um por linha.`;

  try {
    try {
      // Create fresh instance before call
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional."
        },
      });
      if (response && response.text) {
        return { text: response.text, source: 'LIVE' as const, grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
      }
    } catch (e) {
      console.warn("News grounding failed, falling back to basic generation.", e);
    }
    
    const fallbackResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { systemInstruction: "És o animador da Web Rádio Figueiró." }
    });
    return { text: fallbackResponse.text || FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };
  } catch (error) {
    console.error("fetchLatestNews error:", error);
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
  } catch (error) {
    console.error("getRadioAssistantResponse error:", error);
    return "Error.";
  }
};

/**
 * Fetches real cultural events in Amarante using Google Search grounding.
 * Returns formatted blocks expected by AgendaCultural component.
 */
export const fetchCulturalEvents = async () => {
  const key = process.env.API_KEY;
  if (!key) {
    // Component expects this error to trigger key selection dialog or alert
    throw new Error("MISSING_KEY");
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

    return { text: response.text };
  } catch (error) {
    console.error("Error fetching cultural events:", error);
    throw error;
  }
};
