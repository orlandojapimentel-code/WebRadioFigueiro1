
import { GoogleGenAI } from "@google/genai";

// Função para obter resposta da assistente (Chat)
export const getRadioAssistantResponse = async (message: string) => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  // Instância única por pedido para garantir frescura da chave
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemPrompt = "És a 'Figueiró AI', assistente oficial da Web Rádio Figueiró em Amarante. Responde sempre em Português de Portugal, de forma curta (máx 2 frases), alegre e usa emojis. Se te pedirem notícias, diz que as podem ver no painel ao lado ou no rodapé.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95,
      },
    });
    
    return response.text || "Estou aqui para ajudar! O que gostarias de ouvir hoje? 🎙️";
  } catch (error) {
    console.error("Erro no Chat IA:", error);
    throw error;
  }
};

// Função para buscar notícias reais com busca Google
export const fetchLatestNews = async () => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Prompt mais direto para evitar respostas divagantes
    const prompt = "Lista as 5 notícias mais importantes e recentes de hoje em Amarante, Portugal. Escreve apenas o título de cada notícia seguido do link. Não uses explicações.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Menor temperatura para resultados mais factuais
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
    const prompt = "Procura eventos culturais próximos em Amarante, Portugal (concertos, festas, exposições). Lista 5 eventos com TITULO, DATA e LOCAL.";

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
