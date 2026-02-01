
import { GoogleGenAI } from "@google/genai";

/**
 * Inicializa o SDK de forma segura.
 */
const getAIInstance = () => {
  const key = process.env.API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Busca notícias ou curiosidades sobre Amarante.
 * Esta função é "silenciosa": se falhar, retorna um objeto vazio em vez de lançar erro.
 */
export const fetchLatestNews = async () => {
  const ai = getAIInstance();
  if (!ai) return { text: "", source: 'NONE', grounding: [] };

  const model = 'gemini-3-flash-preview';
  const prompt = "Lista 5 notícias ou curiosidades curtas sobre Amarante, Portugal. Apenas os títulos, um por linha.";

  try {
    // Tenta primeiro com pesquisa em tempo real
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto e direto."
        },
      });

      if (response && response.text) {
        return { 
          text: response.text, 
          source: 'LIVE',
          grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
        };
      }
    } catch (e) {
      // Falha na pesquisa? Tenta geração normal (IA Knowledge)
    }

    const fallback = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "És o animador da Web Rádio Figueiró. Gera títulos interessantes sobre Amarante."
      }
    });

    return { 
      text: fallback?.text || "", 
      source: 'LOCAL',
      grounding: [] 
    };

  } catch (error) {
    console.error("Gemini Service: Erro silenciado para evitar crash.");
    return { text: "", source: 'NONE', grounding: [] };
  }
};

/**
 * Resposta do Assistente de Chat.
 */
export const getRadioAssistantResponse = async (message: string) => {
  const ai = getAIInstance();
  if (!ai) return "Olá! O meu sistema de IA está a carregar. Tenta de novo num momento!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "És a 'Figueiró AI', assistente da Web Rádio Figueiró. Responde de forma curta e simpática em Português de Portugal. Foca-te em música e Amarante.",
      },
    });
    
    return response.text || "Estou a ouvir-te! Como posso ajudar na tua audição hoje?";
  } catch (error) {
    return "Olá! Estou a ter um pequeno problema de sinal, mas podes continuar a ouvir a rádio. Tenta falar comigo daqui a pouco! 🎙️";
  }
};

export const fetchCulturalEvents = async () => {
  const ai = getAIInstance();
  if (!ai) return { text: "" };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Lista eventos em Amarante, Portugal.",
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text || "" };
  } catch (error) {
    return { text: "" };
  }
};
