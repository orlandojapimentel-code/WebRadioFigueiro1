
import { GoogleGenAI } from "@google/genai";

// Always obtain the API key exclusively from process.env.API_KEY
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error("MISSING_KEY");
  }

  // Always use named parameter for initialization and use it directly
  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a assistente oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Portugal.
    PERSONALIDADE: Muito alegre, usa termos de rádio.
    MISSÃO: Receber pedidos de música e dedicatórias.
    REGRAS: Respostas em Português de Portugal, curtas (máx 2 frases). Usa emojis 🎙️📻.
    NOTA: Avisa subtilmente que o ouvinte pode clicar no botão "Enviar para o DJ" abaixo da mensagem dele para enviar o pedido diretamente para o estúdio via WhatsApp.
  `;

  try {
    // Calling generateContentStream with model name and prompt directly
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
      // Accessing the .text property directly (not a method)
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    console.error("Erro na Figueiró AI:", error);
    // Handle key-related errors and trigger re-selection in the UI
    if (error.status === 403 || error.message?.includes("key") || error.message?.includes("Requested entity was not found")) {
      throw new Error("INVALID_KEY");
    }
    throw error;
  }
};
