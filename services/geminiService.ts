
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Tenta capturar a chave de todas as formas possíveis no browser/Vercel
  let key: string | undefined;
  
  try {
    // @ts-ignore
    key = process.env.API_KEY || process.env.VITE_API_KEY;
  } catch (e) {
    key = (window as any).API_KEY || (window as any).VITE_API_KEY;
  }

  // Verificação rigorosa
  if (!key || key === "undefined" || key === "" || key.length < 10) {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: key });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a assistente inteligente da Web Rádio Figueiró.
    LOCAL: Figueiró, Paços de Ferreira, Portugal.
    PERSONALIDADE: Muito alegre, comunicativa, usa gírias de rádio ("estamos no ar", "sintonizados").
    OBJETIVO: Receber pedidos de música e dedicatórias dos ouvintes.
    REGRAS: Respostas curtas (máximo 2 frases). Usa emojis: 🎙️ 📻 ✨.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
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
    console.error("Erro na Figueiró AI:", error);
    if (error.status === 403) throw new Error("INVALID_KEY");
    throw error;
  }
};
