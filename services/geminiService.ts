
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 * A variável process.env.API_KEY é injetada automaticamente pelo ambiente.
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
 * Otimizado para o NewsTicker com modelo Flash para menor latência.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Pesquisa e lista 5 notícias de hoje ou desta semana de Amarante, Portugal. Devolve apenas os títulos, um por linha. Não escrevas introduções nem conclusões.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        systemInstruction: "És um gerador de feeds de notícias. Responde apenas com os títulos das notícias, sem numeração, sem asteriscos e sem frases de cortesia. Uma notícia por linha.",
        tools: [{ googleSearch: {} }],
        temperature: 0.0, // Máxima precisão
      },
    });

    const text = response.text || "";
    return { 
      text, 
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    console.error("Erro na busca de notícias WRF:", error);
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
