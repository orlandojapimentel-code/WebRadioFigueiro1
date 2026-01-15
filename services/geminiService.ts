
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
 * Procura os eventos mais recentes em Amarante via Google Search
 * Focado em obter URLs de imagens reais.
 */
export const fetchCulturalEvents = async () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Acede ao site https://www.viralagenda.com/pt/p/municipiodeamarante e identifica os próximos 6 eventos.
    É EXTREMAMENTE IMPORTANTE que tentes encontrar o URL direto da imagem do cartaz (Poster) para cada evento.
    
    Para cada evento responde APENAS com esta estrutura:
    EVENTO_START
    TITULO: [Nome]
    DATA: [Data Formatada]
    LOCAL: [Local em Amarante]
    TIPO: [Concerto, Exposição, Teatro, Festa ou Cinema]
    IMAGEM: [URL completo do ficheiro .jpg ou .png da imagem do cartaz]
    LINK: [URL da página do evento]
    EVENTO_END`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    return { text };
  } catch (error) {
    console.error("Erro ao procurar eventos:", error);
    return null;
  }
};
