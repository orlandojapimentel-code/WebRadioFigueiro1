
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  let apiKey: string | undefined;
  
  try {
    // Tenta primeiro a chave padrão exigida
    // @ts-ignore
    apiKey = process.env.API_KEY;
    
    // Se estiver vazia, tenta a VITE_API_KEY que vimos nas fotos do Vercel
    if (!apiKey || apiKey === "undefined") {
      // @ts-ignore
      apiKey = process.env.VITE_API_KEY;
    }
  } catch (e) {
    // Fallback para window caso o process.env não seja injetado no browser pelo Vercel
    apiKey = (window as any).API_KEY || (window as any).VITE_API_KEY;
  }
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a voz digital da Web Rádio Figueiró.
    LOCAL: Figueiró, Portugal.
    TOM: Alegre, prestável e apaixonada por música.
    TAREFA: Aceita dedicatórias, sugere músicas e interage com os ouvintes.
    REGRAS: Respostas curtas. Usa emojis. 🎙️📻✨
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
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
    if (error.status === 403 || error.status === 401) throw new Error("INVALID_KEY");
    throw error;
  }
};
