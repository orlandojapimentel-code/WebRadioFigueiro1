
import { GoogleGenAI } from "@google/genai";

// Função para obter resposta da assistente (Simplificada)
export const getRadioAssistantResponse = async (message: string) => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemPrompt = "És a 'Figueiró AI', assistente oficial da Web Rádio Figueiró em Amarante. Responde sempre em Português de Portugal, de forma curta e alegre.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });
    
    return response.text || "Olá! Como posso ajudar hoje? 🎙️";
  } catch (error) {
    console.error("Erro no Chat IA:", error);
    throw error;
  }
};

// Função para buscar notícias reais com busca Google - Focada no Ticker e Widget
export const fetchLatestNews = async () => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Prompt ultra-específico para garantir par Título | URL
    const prompt = "Pesquisa as 5 notícias mais recentes e relevantes sobre Amarante, Portugal. Fontes: Tâmega TV, Jornal A Verdade, ou JN. Retorna APENAS uma lista no formato: Título da Notícia | URL da Notícia. Não uses números, nem asteriscos, nem introduções.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    return { 
      text: response.text || "",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Erro na busca de notícias:", error);
    throw error;
  }
};

/**
 * Procura os eventos culturais em Amarante
 */
export const fetchCulturalEvents = async () => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = "Lista eventos culturais próximos em Amarante, Portugal. Formato: Título, Data, Local.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    return { text: response.text || "" };
  } catch (error) {
    console.error("Erro na busca de eventos culturais:", error);
    throw error;
  }
};

export const getRadioAssistantStream = async (message: string, onChunk: (text: string) => void) => {
  return getRadioAssistantResponse(message).then(text => onChunk(text || ""));
};
