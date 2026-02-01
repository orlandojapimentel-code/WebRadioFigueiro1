
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 * O API_KEY é obtido exclusivamente do ambiente, conforme as diretrizes.
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
    // Prompt focado em obter apenas os factos/títulos recentes
    const prompt = "Através de pesquisa web, lista as 5 notícias mais recentes e importantes de Amarante (Portugal) publicadas nas últimas 24 horas. Escreve apenas os títulos das notícias, um por linha, sem introduções ou frases de cortesia.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Quase puramente factual
      },
    });

    const text = response.text || "";
    
    if (text.length < 10) {
      throw new Error("Conteúdo insuficiente retornado.");
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
    const prompt = "Pesquisa e lista eventos culturais e festas populares agendadas para os próximos dias em Amarante, Portugal.";
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
