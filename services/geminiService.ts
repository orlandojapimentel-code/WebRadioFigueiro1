
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Procura a chave em todas as localizações possíveis injetadas pelo Vercel
  let apiKey: string | undefined;
  
  try {
    // @ts-ignore
    apiKey = process.env.VITE_API_KEY || process.env.API_KEY;
  } catch (e) {
    // Fallback para variáveis globais injetadas no browser
    apiKey = (window as any).VITE_API_KEY || (window as any).API_KEY;
  }
  
  // Se a chave for "undefined" (comum em builds estáticos do Vercel), tentamos usar a env diretamente
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    // @ts-ignore
    apiKey = typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
  }

  if (!apiKey) {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a voz digital da Web Rádio Figueiró (Figueiró, Paços de Ferreira).
    TOM: Muito alegre, prestável e próxima dos ouvintes.
    MISSÃO: Aceita pedidos de música, lê dedicatórias e promove a rádio.
    REGRAS: Respostas curtas e calorosas. Usa emojis como 🎙️, 📻 e ✨.
  `;

  try {
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
    console.error("Gemini Error:", error);
    throw error;
  }
};
