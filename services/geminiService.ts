
import { GoogleGenAI } from "@google/genai";

/**
 * Helper para instanciar o SDK com segurança.
 * No Vercel, tentamos aceder a process.env de forma segura.
 */
const getAIInstance = () => {
  // Acesso seguro para evitar ReferenceError em browsers que não definem 'process'
  const env = (typeof process !== 'undefined' && process.env) ? process.env : (window as any).process?.env;
  const apiKey = env?.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    console.warn("WRF Service: API_KEY não detetada. O sistema entrará em modo de fallback.");
    throw new Error("MISSING_KEY");
  }
  
  return new GoogleGenAI({ apiKey });
};

// Busca de notícias otimizada para o Ticker e Widget lateral
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    // Prompt ultra-direto para evitar lixo na resposta
    const prompt = "Diz 5 notícias curtas de Amarante e região (últimos dias). Escreve apenas os títulos, um por linha, sem números ou símbolos.";

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

export const getRadioAssistantResponse = async (message: string) => {
  try {
    const ai = getAIInstance();
    const systemPrompt = "És a 'Figueiró AI', assistente da Web Rádio Figueiró. Responde sempre em Português de Portugal, de forma curta e alegre.";
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
    return "Olá! De momento estou a sintonizar as minhas ideias. Tenta de novo em breve! 🎙️";
  }
};

export const fetchCulturalEvents = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Lista eventos culturais em Amarante. Formato: Título, Data, Local.";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.3 },
    });
    return { text: response.text || "" };
  } catch (error) {
    throw error;
  }
};

export const getRadioAssistantStream = async (message: string, onChunk: (text: string) => void) => {
  return getRadioAssistantResponse(message).then(text => onChunk(text || ""));
};
