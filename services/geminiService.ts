
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para máxima resiliência e formato de saída rígido.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-PT');
    
    // Prompt ultra-direto para evitar "conversas" da IA
    const prompt = `NOTÍCIAS AMARANTE ${dateStr}. 
    Lista 5 acontecimentos recentes. 
    REGRAS: 
    - Apenas títulos curtos.
    - Sem números no início.
    - Sem introduções.
    - Um por linha.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0, 
        systemInstruction: "És um extrator de dados. Responde APENAS com a lista de notícias. Nunca digas 'Aqui estão' ou 'Encontrei'. Se não encontrares nada, devolve vazio."
      },
    });

    const text = response.text || "";
    
    if (text.trim().length < 5) {
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
    const prompt = "Lista eventos culturais em Amarante, Portugal hoje.";
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
