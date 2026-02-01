
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante usando Google Search.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-PT');
    
    // Prompt otimizado para extração de dados limpos
    const prompt = `PESQUISA: Notícias atuais e eventos em Amarante, Portugal (${dateStr}). 
    Escreve 5 títulos curtos e factuais.
    IMPORTANTE: Separa cada notícia com o símbolo | (barra vertical).
    Exemplo: Notícia 1 | Notícia 2 | Notícia 3`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
        systemInstruction: "És um ticker de notícias. Fornece apenas títulos de notícias de Amarante separados por |. Não uses introduções nem markdown."
      },
    });

    const text = response.text || "";
    
    if (text.length < 10) {
      throw new Error("Conteúdo insuficiente");
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
    const prompt = "Lista eventos culturais em Amarante, Portugal para os próximos dias.";
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
