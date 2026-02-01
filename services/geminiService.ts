
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para máxima precisão e ativação da ferramenta de busca.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const now = new Date().toLocaleDateString('pt-PT');
    
    // Prompt extremamente direto para evitar "conversa" da IA
    const prompt = `DATA ATUAL: ${now}. PESQUISA WEB OBRIGATÓRIA: Encontra as 5 notícias mais recentes de Amarante, Portugal. 
    Regras: 
    1. Retorna apenas os títulos, um por linha. 
    2. Não uses introduções como "Aqui estão". 
    3. Foca-te em jornais locais como 'A Verdade', 'Jornal de Amarante' ou 'Tâmega TV'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0, // Precisão absoluta
        systemInstruction: "És um extrator de notícias em tempo real. A tua única função é fornecer títulos de notícias factuais e recentes de Amarante."
      },
    });

    const text = response.text || "";
    
    if (text.length < 15) {
      throw new Error("Resposta da IA demasiado curta ou vazia.");
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
    const prompt = "Lista eventos culturais em Amarante, Portugal para os próximos dias usando pesquisa web.";
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
