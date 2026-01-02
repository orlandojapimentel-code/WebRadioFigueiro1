
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Inicialização obrigatória com a variável de ambiente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", locutora oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Paços de Ferreira, Portugal.
    REGRAS: Respostas curtas, alegres e com emojis. Trata todos como "família".
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
    console.error("Erro API:", error);
    // Captura erros de chave inválida ou falta de redeploy
    if (error.status === 403 || error.status === 401 || error.message?.toLowerCase().includes("api key")) {
      throw new Error("AUTH_ERROR");
    }
    throw error;
  }
};
