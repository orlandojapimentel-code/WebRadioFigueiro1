
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Otimizado para máxima captura de resultados recentes.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-PT');
    
    // Prompt mais "humano" para ativar melhor a ferramenta de pesquisa
    const prompt = `Quais são as notícias e eventos mais recentes em Amarante, Portugal? 
    Pesquisa no Google e resume em 5 títulos curtos e interessantes para um rodapé de rádio. 
    Hoje é dia ${dateStr}. Foca-te no que aconteceu nos últimos dias.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.5, // Ligeiro aumento para permitir variação na pesquisa
        systemInstruction: "És um jornalista da Web Rádio Figueiró. A tua missão é pesquisar notícias de Amarante e devolver apenas os títulos, um por linha. Não uses introduções nem formatação markdown."
      },
    });

    const text = response.text || "";
    
    // Se o texto for muito curto, tentamos uma pesquisa de reserva sem data específica
    if (text.trim().length < 10) {
      throw new Error("Resposta insuficiente");
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
