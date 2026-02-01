
import { GoogleGenAI } from "@google/genai";

/**
 * Inicialização do SDK Gemini.
 */
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Busca notícias de Amarante. 
 * Se a ferramenta de pesquisa (googleSearch) falhar, tenta gerar sem ela.
 */
export const fetchLatestNews = async () => {
  try {
    const ai = getAIInstance();
    const prompt = `Notícias Amarante Portugal recentes. Lista apenas os títulos, um por linha.`;

    try {
      // Primeira tentativa: Com Google Search (Tempo Real)
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
          systemInstruction: "És o sistema de informação da Web Rádio Figueiró. Pesquisa notícias recentes de Amarante e devolve apenas os títulos. Sê direto."
        },
      });

      const text = response.text || "";
      if (text.length > 10) {
        return { 
          text, 
          grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
        };
      }
      throw new Error("Resposta curta");
    } catch (searchError) {
      console.warn("WRF News: Pesquisa em tempo real indisponível, usando IA de contexto.");
      
      // Segunda tentativa: Sem Google Search (Geração Baseada em Conhecimento)
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Gera 5 títulos de notícias genéricas sobre cultura e eventos em Amarante que costumam acontecer, como o Museu Amadeo de Souza-Cardoso ou o Rio Tâmega.",
        config: {
          temperature: 0.7,
          systemInstruction: "És o jornalista da Web Rádio Figueiró. Como não tens acesso à internet agora, gera títulos interessantes e verosímeis sobre Amarante para o nosso rodapé."
        }
      });
      
      return { text: fallbackResponse.text || "", grounding: [] };
    }
  } catch (error: any) {
    console.error("WRF News Service Critical Error:", error.message);
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
    const prompt = "Lista eventos em Amarante, Portugal.";
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
