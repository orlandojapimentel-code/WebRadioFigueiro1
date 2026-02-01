
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
    const now = new Date().toLocaleDateString('pt-PT');
    
    // Prompt focado em obter texto simples para evitar falhas de processamento
    const prompt = `Notícias de Amarante, Portugal hoje (${now}). Pesquisa na web e escreve 5 títulos curtos. 
    REGRAS CRÍTICAS: 
    1. Escreve APENAS os títulos, um por linha.
    2. NÃO uses números (1., 2.), nem pontos, nem traços, nem asteriscos.
    3. NÃO escrevas introduções nem conclusões.
    Exemplo de formato esperado:
    Título da primeira notícia aqui
    Título da segunda notícia aqui`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0,
        systemInstruction: "És um servidor de dados. Deves responder apenas com os títulos das notícias encontradas na pesquisa web sobre Amarante, sem qualquer formatação ou conversa."
      },
    });

    const text = response.text || "";
    
    if (text.length < 10) {
      throw new Error("Resposta insuficiente.");
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
    const prompt = "Lista eventos culturais em Amarante, Portugal usando pesquisa web.";
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
