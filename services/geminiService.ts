
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 * Cria uma nova instância a cada chamada para garantir o uso da chave mais recente.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante. 
 * Lógica de tripla redundância: Search -> IA Knowledge -> Static Fallback.
 */
export const fetchLatestNews = async () => {
  const ai = getAIInstance();
  const modelName = 'gemini-flash-latest';
  
  const promptRealTime = "Lista 5 títulos de notícias recentes sobre Amarante, Portugal. Apenas os títulos.";
  const promptCreative = "És o locutor da Web Rádio Figueiró. Escreve 5 curiosidades ou notícias curtas sobre Amarante para passar no nosso rodapé (ex: cultura, gastronomia, turismo). Devolve apenas os títulos.";

  try {
    // TENTATIVA 1: Pesquisa em Tempo Real (Requer Billing ativo na GCP)
    try {
      const response = await ai.models.generateContent({
        model: modelName, 
        contents: { parts: [{ text: promptRealTime }] },
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
          systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê factual e devolve apenas uma lista de títulos."
        },
      });

      if (response.text && response.text.length > 15) {
        return { 
          text: response.text, 
          source: 'LIVE',
          grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
        };
      }
    } catch (e) {
      console.warn("WRF: Pesquisa em tempo real bloqueada ou indisponível.");
    }

    // TENTATIVA 2: Geração via Conhecimento da IA (Modo Digital/Local)
    const fallbackResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: promptCreative }] },
      config: {
        temperature: 0.8,
        systemInstruction: "És o jornalista digital da Web Rádio Figueiró. Informa os nossos ouvintes sobre a beleza e eventos de Amarante."
      }
    });

    return { 
      text: fallbackResponse.text || "", 
      source: 'LOCAL',
      grounding: [] 
    };

  } catch (error: any) {
    console.error("WRF Service Error:", error.message);
    throw error;
  }
};

/**
 * Resposta do Assistente de Chat.
 */
export const getRadioAssistantResponse = async (message: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: { parts: [{ text: message }] },
      config: {
        systemInstruction: "És a 'Figueiró AI', assistente da Web Rádio Figueiró. Responde de forma curta, simpática e em Português de Portugal. Ajuda os ouvintes com música e curiosidades de Amarante.",
        temperature: 0.7,
      },
    });
    
    return response.text || "Olá! Como posso ajudar a tua audição hoje?";
  } catch (error: any) {
    console.error("Assistant Error:", error.message);
    return "Olá! Estou a ter um pequeno problema de sinal, mas podes continuar a ouvir a rádio. Tenta falar comigo daqui a pouco! 🎙️";
  }
};

export const fetchCulturalEvents = async () => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: { parts: [{ text: "Lista eventos em Amarante, Portugal." }] },
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "" };
  } catch (error) {
    throw error;
  }
};
