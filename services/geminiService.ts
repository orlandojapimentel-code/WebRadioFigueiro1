
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 * Tenta obter a chave de múltiplas fontes comuns em ambientes de produção.
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.warn("WRF Service: API_KEY não detetada. Verifique as variáveis de ambiente no Vercel.");
    throw new Error("MISSING_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para o modelo Gemini 3 Flash.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    // Prompt mais direto e imperativo para forçar o uso da ferramenta de busca
    const prompt = "PESQUISA WEB OBRIGATÓRIA: Quais são as 5 notícias mais importantes e recentes de hoje (2025/2026) em Amarante, Portugal? Escreve apenas uma lista de títulos, um por linha, sem introduções.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Menor temperatura = mais factual
      },
    });

    const text = response.text || "";
    
    if (text.length < 5) {
      throw new Error("Resposta da IA vazia ou insuficiente.");
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
    const prompt = "PESQUISA: Eventos culturais hoje e esta semana em Amarante, Portugal.";
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
