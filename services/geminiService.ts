
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

export const fetchLatestNews = async () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Prompt ultra-estrito para evitar Markdown ou conversas da IA
    const prompt = `SEARCH AND LIST: Find the 5 most recent and relevant news from today about Amarante (Portugal) and Portugal general news. 
    Format each news EXACTLY as follows, with NO markdown, NO bold, NO code blocks:
    
    NEWS_ITEM
    TITLE: [Title]
    SOURCE: [Newspaper Name]
    TYPE: [LOCAL or NACIONAL]
    SUMMARY: [1 sentence]
    URL: [Direct link]
    END_ITEM`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    return { 
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks 
    };
  } catch (error: any) {
    console.error("Erro na busca de notícias:", error);
    throw error;
  }
};

export const fetchCulturalEvents = async () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Find 6 upcoming cultural events in Amarante, Portugal. 
    Format: 
    EVENTO_START
    TITULO: [Nome]
    DATA: [Data]
    LOCAL: [Local]
    TIPO: [Tipo]
    IMAGEM: [URL]
    LINK: [URL]
    EVENTO_END`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    return { text: response.text };
  } catch (error: any) {
    console.error("Erro na busca de eventos:", error);
    throw error;
  }
};
