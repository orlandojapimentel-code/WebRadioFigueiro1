
import { GoogleGenAI } from "@google/genai";

/**
 * Helper para instanciar o SDK com segurança e diagnóstico claro.
 * Em produção (Vercel), a API_KEY deve ser configurada nas Environment Variables.
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error(
      "❌ ERRO DE CONFIGURAÇÃO: A variável API_KEY não foi encontrada.\n" +
      "Se estás no Vercel, vai a Settings > Environment Variables e adiciona a tua chave com o nome API_KEY."
    );
    throw new Error("MISSING_KEY");
  }
  
  return new GoogleGenAI({ apiKey });
};

// Função para obter resposta da assistente (Simplificada)
export const getRadioAssistantResponse = async (message: string) => {
  try {
    const ai = getAIInstance();
    const systemPrompt = "És a 'Figueiró AI', assistente oficial da Web Rádio Figueiró em Amarante. Responde sempre em Português de Portugal, de forma curta e alegre.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });
    
    return response.text || "Olá! Como posso ajudar hoje? 🎙️";
  } catch (error) {
    console.error("Erro no Chat IA:", error);
    throw error;
  }
};

// Função para buscar notícias reais com busca Google - Otimizada para Ticker
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Quais são as notícias e eventos mais recentes de Amarante, Portugal (última semana)? Escreve apenas os títulos, um por linha. Não uses números, listas, asteriscos ou introduções.";

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

/**
 * Procura os eventos culturais em Amarante
 */
export const fetchCulturalEvents = async () => {
  try {
    const ai = getAIInstance();
    const prompt = "Lista eventos culturais próximos em Amarante, Portugal. Formato: Título, Data, Local.";

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
