
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Criamos a instância no momento do pedido. 
  // Isso garante que se o utilizador sintonizou via window.aistudio, a nova chave será usada.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", locutora oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Paços de Ferreira.
    MISSÃO: Dar as boas vindas, aceitar dedicatórias e ser a alma da rádio.
    PERSONALIDADE: Muito alegre, usa gírias do norte de Portugal de forma carinhosa.
    REGRAS: Máximo 3 frases. Usa emojis. Refere sempre a rádio com orgulho.
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
    console.error("Erro API:", error);
    // 401/403 ou mensagens específicas de erro de chave
    const errorStr = (error.message || "").toLowerCase();
    if (error.status === 403 || error.status === 401 || errorStr.includes("api key") || errorStr.includes("invalid")) {
      throw new Error("AUTH_ERROR");
    }
    throw error;
  }
};
