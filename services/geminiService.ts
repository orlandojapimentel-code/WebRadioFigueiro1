
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `
      IDENTIDADE: És a "Figueiró AI", a assistente oficial da Web Rádio Figueiró.
      LOCAL: Figueiró, Portugal.
      PERSONALIDADE: Alegre, entusiasta, usa termos de rádio.
      MISSÃO: Receber pedidos de música e dedicatórias.
      REGRAS: Português de Portugal, respostas curtas (máx 2 frases). Usa emojis 🎙️📻.
    `;

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Pesquisa eventos reais em Amarante usando Google Search.
 */
export const fetchCulturalEvents = async () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `PESQUISA ATUALIZADA: Próximos eventos culturais, concertos e exposições em Amarante, Portugal (mês atual e próximo).
    
    FORMATO OBRIGATÓRIO DE RESPOSTA (SEM MARKDOWN):
    
    EVENTO_START
    TITULO: [Nome]
    DATA: [Ex: 15 de Fevereiro]
    LOCAL: [Local exato]
    TIPO: [CONCERTO, EXPOSIÇÃO, TEATRO ou FESTA]
    IMAGEM: [URL real da imagem do evento]
    LINK: [URL do evento]
    EVENTO_END
    
    (Gera 6 blocos destes)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    return { text: response.text || "" };
  } catch (error) {
    console.error("Erro na busca de eventos:", error);
    return null;
  }
};
