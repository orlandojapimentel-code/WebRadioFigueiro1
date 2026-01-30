
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 * A variável process.env.API_KEY é injetada automaticamente pelo ambiente.
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.warn("WRF Service: API_KEY não detetada. Verifique as configurações no Vercel.");
    throw new Error("MISSING_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Busca notícias de Amarante usando Google Search.
 * Utilizamos o modelo Pro para garantir melhor interpretação dos resultados de pesquisa.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    // Prompt extremamente simplificado para evitar ruído na resposta
    const prompt = "Dá-me os títulos de 5 notícias reais e recentes de Amarante, Portugal. Escreve apenas um título por linha. Não enumeres nem uses marcadores.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgrade para o Pro para melhor grounding em tarefas de pesquisa
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Quase zero para evitar alucinações
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
