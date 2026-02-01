
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 * O API_KEY é obtido exclusivamente do ambiente, conforme as diretrizes.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para o modelo Gemini 3 Flash.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    // Prompt otimizado para busca web em tempo real
    const prompt = "PESQUISA WEB OBRIGATÓRIA: Quais são as 5 notícias mais recentes de Amarante, Portugal, publicadas hoje ou ontem? Fornece apenas os títulos, um por linha, sem introduções ou frases de cortesia.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0, // Zero para máxima precisão factual
      },
    });

    const text = response.text || "";
    
    if (text.length < 5) {
      throw new Error("Resposta da IA demasiado curta.");
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
    const prompt = "Lista eventos culturais recentes e próximos em Amarante, Portugal usando pesquisa web.";
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
