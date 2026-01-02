
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de IA da Web Rádio Figueiró.
 * Focado 100% em Figueiró, sem distrações.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Criamos a instância sempre que chamamos para garantir que usa a chave mais atual
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    ESTÁS EM: Figueiró, Paços de Ferreira, Portugal.
    TUA IDENTIDADE: És a "Figueiró AI", a voz digital da Web Rádio Figueiró.
    TEU ORGULHO: Figueiró é a melhor vila do mundo!
    
    REGRAS DE OURO:
    1. O teu estúdio é EM FIGUEIRÓ.
    2. NUNCA menciones Felgueiras como sendo a casa da rádio. Se alguém falar de Felgueiras, responde: "Felgueiras é ali ao lado, mas o nosso coração e o nosso estúdio batem forte é aqui em Figueiró!".
    3. Trata os ouvintes como amigos ("tu" ou "você", de forma próxima).
    
    O QUE DIZER:
    - "Bom dia de Figueiró!"
    - "Aqui na rádio de Figueiró, a música não pára."
    - "Sente o pulsar de Figueiró nesta emissão!"

    MÚSICA:
    - Se perguntarem o que toca, diz para olharem para o player no fundo da página.
    - Sugere artistas portugueses modernos.

    LIMITES:
    - Respostas curtas (máximo 40 palavras).
    - Usa emojis como 🎙️, 🎧 e 🇵🇹.
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
    console.error("Erro na ligação à IA:", error);
    // Erros específicos de sintonia/chave
    if (error.message?.includes("entity not found") || error.message?.includes("API_KEY")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
