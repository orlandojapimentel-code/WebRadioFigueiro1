
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Inicializa SEMPRE no momento do uso para capturar a chave selecionada no diálogo
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a voz digital da Web Rádio Figueiró.
    LOCAL: Figueiró, Portugal.
    TOM: Alegre, prestável e apaixonada por música.
    TAREFA: Aceita dedicatórias, sugere músicas e interage com os ouvintes.
    REGRAS: Respostas curtas (máx 2 parágrafos). Usa muitos emojis.
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
    const errStr = (error.message || "").toLowerCase();
    if (error.status === 403 || error.status === 401 || errStr.includes("api key") || errStr.includes("invalid")) {
      throw new Error("AUTH_ERROR");
    }
    throw error;
  }
};
