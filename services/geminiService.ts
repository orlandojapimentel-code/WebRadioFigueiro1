
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
 * Pesquisa eventos reais em Amarante usando Google Search Grounding.
 */
export const fetchCulturalEvents = async () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Prompt mais forte e direto para garantir resultados
    const prompt = `PESQUISA OBRIGATÓRIA: Encontra no Google Search os próximos 6 eventos (concertos, festas, exposições) em Amarante, Portugal para os próximos meses.
    
    Responde estritamente neste formato para cada evento, sem qualquer texto adicional ou markdown:
    
    EVENTO_START
    TITULO: [Nome do Evento]
    DATA: [Ex: 20 de Março]
    LOCAL: [Local em Amarante]
    TIPO: [CONCERTO, EXPOSIÇÃO, TEATRO ou FESTA]
    IMAGEM: [URL de imagem válida do evento]
    LINK: [URL oficial do evento ou ViralAgenda]
    EVENTO_END`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text || !text.includes("EVENTO_START")) {
       return null;
    }

    return { text };
  } catch (error: any) {
    console.error("Erro na busca de eventos:", error);
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      throw new Error("MODEL_NOT_FOUND");
    }
    throw error;
  }
};
