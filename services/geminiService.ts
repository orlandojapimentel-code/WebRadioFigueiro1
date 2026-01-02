
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de IA da Web Rádio Figueiró.
 * Utiliza a API_KEY configurada no Vercel para uma ligação estável.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // A chave vem diretamente do ambiente seguro do Vercel
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("SINTONIA_PERDIDA");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    ESTÁS EM: Figueiró, Paços de Ferreira.
    IDENTIDADE: És a "Figueiró AI", locutora e assistente virtual da Web Rádio Figueiró.
    
    PERSONALIDADE: Alegre, nortenha, prestativa e muito orgulhosa da região.
    
    CONTEXTO:
    - Rádio: Web Rádio Figueiró.
    - Local: Figueiró (Paços de Ferreira).
    - Parceiro: FM Rent a Car (Felgueiras).
    
    ESTILO DE RESPOSTA:
    - Curta (máx 35 palavras).
    - Usa emojis de rádio e música (🎙️, 🎧, 🎸).
    - Trata os ouvintes como família.
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
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    if (error.message?.includes("API key") || error.message?.includes("403")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
