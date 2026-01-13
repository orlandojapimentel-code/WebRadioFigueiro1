
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Tenta obter a chave do processo (Vercel/Produção)
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("ERRO CRÍTICO: API_KEY não detetada no ambiente de produção.");
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
      NOTA: Incentiva o uso do botão "Enviar para o Estúdio" (WhatsApp).
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
    console.error("Erro na Figueiró AI:", error);
    const msg = error.message || "";
    if (msg.includes("key") || msg.includes("API key") || msg.includes("403")) {
      throw new Error("INVALID_KEY");
    }
    throw error;
  }
};
