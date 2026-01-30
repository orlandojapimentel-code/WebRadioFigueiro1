
import { GoogleGenAI } from "@google/genai";

// Função para obter resposta da assistente (Chat)
export const getRadioAssistantResponse = async (message: string) => {
  // Use process.env.API_KEY directly and check for its presence
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  // Create a new instance right before the call to ensure the latest key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemPrompt = "És a 'Figueiró AI', assistente da Web Rádio Figueiró (Amarante). Responde de forma curta, alegre e em Português de Portugal. Usa emojis 🎙️.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Erro no Chat IA:", error);
    throw error;
  }
};

// Função para buscar notícias reais
export const fetchLatestNews = async () => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  try {
    // Create a new instance right before the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = "Lista as 5 notícias mais recentes e importantes de hoje sobre Amarante (Portugal) e arredores. Para cada notícia, indica o TÍTULO e o LINK (URL) completo. Não uses tabelas nem markdown complexo.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    return { 
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks 
    };
  } catch (error) {
    console.error("Erro na busca de notícias:", error);
    throw error;
  }
};

/**
 * Procura os eventos culturais em Amarante, Portugal usando Google Search grounding.
 * Formata a resposta para ser processada pelo componente AgendaCultural.
 */
export const fetchCulturalEvents = async () => {
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") throw new Error("MISSING_KEY");

  try {
    // Create a new instance right before the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Procura os eventos culturais mais recentes e futuros em Amarante, Portugal (concertos, exposições, teatro, festas). 
    Lista os próximos 6 eventos. Para cada evento, usa obrigatoriamente este formato exato:
    EVENTO_START
    TITULO: [Nome do evento]
    DATA: [Data do evento, ex: 25 de Março]
    LOCAL: [Local do evento em Amarante]
    TIPO: [CONCERTO, EXPOSIÇÃO, TEATRO, FESTA ou GERAL]
    IMAGEM: [URL de uma imagem representativa se disponível]
    LINK: [URL para mais detalhes]
    EVENTO_END`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    return { text: response.text };
  } catch (error) {
    console.error("Erro na busca de eventos culturais:", error);
    throw error;
  }
};

export const getRadioAssistantStream = async (message: string, onChunk: (text: string) => void) => {
  // Mantemos para compatibilidade, mas o Chat agora usará a versão síncrona se esta falhar
  return getRadioAssistantResponse(message).then(text => onChunk(text || ""));
};
