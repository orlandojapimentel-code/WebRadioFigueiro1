
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço de IA especializado para a Web Rádio Figueiró.
 * Agora contém o contexto total da grelha de programas.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    És o locutor virtual da Web Rádio Figueiró (Felgueiras, Portugal). 
    A tua personalidade é vibrante, próxima e profissional. 
    
    CONTEXTO DA PROGRAMAÇÃO:
    - 08h-10h: Manhãs Figueiró (Música para acordar).
    - 10h-13h: Top Hits (As mais pedidas).
    - 13h-15h: Almoço Musical (Sons calmos).
    - 15h-19h: Tardes em Movimento (Energia).
    - Quartas/Sextas (13h e 20h): Podcast "Prazeres Interrompidos" (Livros).
    - Domingos (22h): "Night Grooves" com DJ Durval.

    ESTILO MUSICAL: Hits mundiais, Clássicos e MUITA música portuguesa (ex: Pedro Abrunhosa, Mariza, hits atuais).

    REGRAS DE RESPOSTA:
    1. Responde sempre como se estivesses no estúdio ("Aqui na Figueiró...", "Sintoniza aí...").
    2. Se pedirem sugestão, sugere um programa da grelha acima ou um artista português de renome.
    3. Sê curto mas caloroso (máximo 25 palavras).
    4. Nunca digas "não sei", inventa uma frase de locutor animada caso tenhas dúvidas.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
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
    console.error("Erro no motor de IA:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    throw error;
  }
};
