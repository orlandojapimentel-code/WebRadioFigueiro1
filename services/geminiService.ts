
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Procura em todas as localizações possíveis num ambiente web moderno
  const env = (typeof process !== 'undefined' ? process.env : {}) as any;
  const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : {};
  const win = window as any;

  return (
    env.API_KEY || 
    env.VITE_API_KEY || 
    viteEnv.VITE_API_KEY || 
    viteEnv.API_KEY ||
    win.API_KEY ||
    win.VITE_API_KEY ||
    null
  );
};

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const apiKey = getApiKey();

  // Se não encontrar chave, tentamos verificar se o utilizador já sintonizou via AI Studio
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a assistente oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Portugal.
    PERSONALIDADE: Muito alegre, usa termos de rádio.
    MISSÃO: Receber pedidos de música e dedicatórias.
    REGRAS: Respostas em Português de Portugal, curtas (máx 2 frases). Usa emojis 🎙️📻.
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
    // Erros de permissão ou chave inválida
    if (error.status === 403 || error.message?.includes("key")) {
      throw new Error("INVALID_KEY");
    }
    throw error;
  }
};
