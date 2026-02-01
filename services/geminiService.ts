
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para máxima precisão e retorno de texto limpo.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-PT');
    const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    
    // Prompt positivo e direto para facilitar a extração
    const prompt = `PESQUISA ATUALIZADA: Quais são as notícias mais importantes de Amarante, Portugal, hoje ${dateStr} às ${timeStr}?
    
    REGRAS DE RESPOSTA:
    - Escreve apenas os títulos das notícias.
    - Usa uma linha para cada título.
    - Fornece entre 3 a 5 notícias recentes.
    - Não uses formatação markdown (sem negritos ou asteriscos).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0,
        systemInstruction: "És um ticker de notícias em tempo real. A tua única tarefa é fornecer títulos curtos e factuais baseados em pesquisa web atual."
      },
    });

    const text = response.text || "";
    
    if (text.length < 15) {
      throw new Error("Conteúdo da resposta insuficiente.");
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
    const prompt = "Pesquisa e lista eventos culturais futuros em Amarante, Portugal.";
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
