
import { GoogleGenAI } from "@google/genai";

/**
 * Helper para instanciar o SDK com máxima compatibilidade.
 */
const getAIInstance = () => {
  // Tenta obter a chave de várias fontes possíveis em ambientes de build (Vercel/Vite)
  // @ts-ignore
  const apiKey = process.env.API_KEY || 
                 process.env.VITE_API_KEY || 
                 (window as any).process?.env?.API_KEY ||
                 (import.meta as any).env?.VITE_API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.warn("WRF Debug: API_KEY não encontrada no ambiente. Usando modo de segurança.");
    throw new Error("MISSING_KEY");
  }
  
  return new GoogleGenAI({ apiKey });
};

// Busca de notícias com tratamento de erros robusto
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Diz 5 notícias curtas de Amarante e região. Apenas títulos, um por linha, sem símbolos.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, grounding };
  } catch (error) {
    console.error("Erro fetchLatestNews:", error);
    throw error;
  }
};

export const getRadioAssistantResponse = async (message: string) => {
  try {
    const ai = getAIInstance();
    const systemPrompt = "És a 'Figueiró AI', assistente da Web Rádio Figueiró. Responde sempre em Português de Portugal, de forma curta.";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });
    return response.text || "Olá! Como posso ajudar? 🎙️";
  } catch (error) {
    return "Olá! De momento estou em manutenção técnica. Tenta de novo em breve! 🎙️";
  }
};

export const fetchCulturalEvents = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Eventos culturais em Amarante, Portugal.";
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
