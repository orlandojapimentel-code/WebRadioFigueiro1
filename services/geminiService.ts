
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.warn("WRF Service: API_KEY não detetada.");
    throw new Error("MISSING_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para resposta rápida e extração de títulos.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    // Prompt mais forte para forçar a ferramenta de busca
    const prompt = "SEARCH: Quais são as 5 notícias mais recentes de hoje em Amarante, Portugal? Apresenta apenas uma lista de títulos curtos.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0, // Precisão máxima
      },
    });

    const text = response.text || "";
    // Se não houver texto útil, lançamos erro para o componente usar o fallback
    if (text.length < 20 || text.toLowerCase().includes("não encontrei")) {
      throw new Error("EMPTY_RESPONSE");
    }

    return { 
      text, 
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error: any) {
    console.error("WRF News Service Error:", error.message || error);
    throw error;
  }
};

export const getRadioAssistantResponse = async (message: string) => {
  try {
    const ai = getAIInstance();
    const systemInstruction = "És a 'Figueiró AI', assistente oficial da Web Rádio Figueiró. Responde sempre em Português de Portugal, de forma curta e amigável.";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "Olá! Como posso ajudar hoje? 🎙️";
  } catch (error) {
    return "Olá! De momento estou a afinar a minha antena. Tenta de novo em breve! 🎙️";
  }
};

export const fetchCulturalEvents = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Lista eventos culturais próximos em Amarante, Portugal.";
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
