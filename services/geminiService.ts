
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante. 
 * Lógica de tripla redundância para garantir que o rodapé nunca pare.
 */
export const fetchLatestNews = async () => {
  const ai = getAIInstance();
  const promptRealTime = `Pesquisa notícias muito recentes de Amarante, Portugal (hoje e ontem). Devolve apenas uma lista de títulos, sem comentários.`;
  const promptCreative = `És o jornalista da Web Rádio Figueiró. Cria 5 títulos de notícias ou curiosidades interessantes e verosímeis sobre Amarante (ex: Museus, Rio Tâmega, Gastronomia, Eventos típicos). Lista apenas os títulos.`;

  try {
    // TENTATIVA 1: Pesquisa em Tempo Real (Google Search Grounding)
    // Isto só funciona se o Billing estiver ativo na consola Google Cloud
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: promptRealTime,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
          systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê factual e direto."
        },
      });

      if (response.text && response.text.length > 20) {
        return { 
          text: response.text, 
          source: 'LIVE',
          grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
        };
      }
    } catch (e) {
      console.warn("WRF: Google Search não disponível. A mudar para modo criativo local...");
    }

    // TENTATIVA 2: Geração Criativa Local (Sem ferramentas)
    // Funciona com qualquer chave de API básica, sem faturamento
    const fallbackResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptCreative,
      config: {
        temperature: 0.8,
        systemInstruction: "És o animador da Web Rádio Figueiró. Gera títulos curtos e apelativos sobre Amarante para o nosso rodapé."
      }
    });

    return { 
      text: fallbackResponse.text || "", 
      source: 'LOCAL',
      grounding: [] 
    };

  } catch (error: any) {
    console.error("WRF News Service Critical Failure:", error.message);
    throw error;
  }
};

export const getRadioAssistantResponse = async (message: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "És a 'Figueiró AI', assistente da Web Rádio Figueiró. Responde de forma curta e simpática em Português de Portugal.",
        temperature: 0.7,
      },
    });
    return response.text || "Olá! Em que posso ajudar?";
  } catch (error) {
    return "Olá! Tenta de novo em instantes. 🎙️";
  }
};

export const fetchCulturalEvents = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Lista eventos em Amarante, Portugal.";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "" };
  } catch (error) {
    throw error;
  }
};

export const getRadioAssistantStream = async (message: string, onChunk: (text: string) => void) => {
  return getRadioAssistantResponse(message).then(text => onChunk(text || ""));
};
