
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
 * Procura os eventos mais recentes em Amarante.
 * Se falhar, o componente frontend lidará com dados de fallback.
 */
export const fetchCulturalEvents = async () => {
  const apiKey = process.env.API_KEY;
  // Se não houver chave, retorna null imediatamente para o fallback atuar
  if (!apiKey || apiKey === "undefined" || apiKey === "") return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Age como um crawler de eventos. Pesquisa os próximos 6 eventos em Amarante no site viralagenda.com.
    Responde APENAS no formato abaixo, sem markdown, sem explicações:
    
    EVENTO_START
    TITULO: Nome do Evento
    DATA: Dia de Mês
    LOCAL: Localização
    TIPO: Concerto/Teatro/Festa/Exposição
    IMAGEM: URL da imagem ou null
    LINK: URL do Viral Agenda
    EVENTO_END`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    return { text: response.text || "" };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
