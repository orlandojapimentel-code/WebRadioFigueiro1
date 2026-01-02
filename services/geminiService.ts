
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de IA da Web Rádio Figueiró.
 * Configurado para ler a chave do ambiente Vercel (process.env.API_KEY).
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Aceder à chave configurada no Vercel
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    console.error("Erro: API_KEY não detetada no ambiente.");
    throw new Error("SINTONIA_PERDIDA");
  }

  // Inicialização com a chave do Vercel
  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    ESTÁS EM: Figueiró, Paços de Ferreira.
    IDENTIDADE: És a "Figueiró AI", a assistente oficial da Web Rádio Figueiró.
    
    PERSONALIDADE: Alegre, nortenha, muito prestável.
    
    CONTEXTO LOCAL:
    - Rádio: Web Rádio Figueiró (Figueiró, Paços de Ferreira).
    - Parceiro Especial: FM Rent a Car (Alojamento Local e Mobilidade em Felgueiras).
    
    OBJETIVO: Ajudar com dedicatórias, informações da rádio e sugestões musicais.
    
    REGRAS: 
    - Máximo 40 palavras.
    - Sê calorosa.
    - Usa emojis como 🎙️, 🎧, 💙.
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
    console.error("Erro na emissão da IA:", error);
    if (error.message?.includes("API key") || error.message?.includes("403")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
