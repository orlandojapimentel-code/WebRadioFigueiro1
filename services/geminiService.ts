
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const apiKey = process.env.API_KEY;
  
  // 1. Verificar se a variável de ambiente sequer existe
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a voz digital da Web Rádio Figueiró.
    LOCAL: Figueiró, Portugal.
    TOM: Alegre, prestável e apaixonada por música.
    TAREFA: Aceita dedicatórias, sugere músicas e interage com os ouvintes.
    REGRAS: Respostas curtas (máx 2 parágrafos). Usa muitos emojis. 🎙️📻✨
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
    console.error("Gemini Service Error:", error);
    const errStatus = error.status;
    const errMessage = (error.message || "").toLowerCase();
    
    // 2. Verificar se o Google rejeitou a chave (Chave Errada)
    if (errStatus === 403 || errStatus === 401 || errMessage.includes("api key") || errMessage.includes("invalid")) {
      throw new Error("INVALID_KEY");
    }
    throw error;
  }
};
