
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Obtém a chave diretamente do ambiente
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("Erro: API_KEY não configurada no ambiente.");
    throw new Error("MISSING_KEY");
  }

  // Inicializa o cliente GenAI com a chave obtida
  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a assistente oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Portugal.
    PERSONALIDADE: Muito alegre, usa termos de rádio.
    MISSÃO: Receber pedidos de música e dedicatórias.
    REGRAS: Respostas em Português de Portugal, curtas (máx 2 frases). Usa emojis 🎙️📻.
    NOTA: Avisa que o ouvinte pode clicar no botão "Enviar para o DJ" para enviar via WhatsApp.
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
    console.error("Erro na Figueiró AI:", error);
    
    // Tratamento de erros de chave conforme as guidelines
    const errorMessage = error.message || "";
    if (
      error.status === 403 || 
      errorMessage.includes("key") || 
      errorMessage.includes("API key not valid") ||
      errorMessage.includes("Requested entity was not found")
    ) {
      throw new Error("INVALID_KEY");
    }
    throw error;
  }
};
