
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de Inteligência Artificial da Web Rádio Figueiró.
 * Configurado para máxima personalidade e foco total em Figueiró.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // A chave é obtida do ambiente. No site público, deve ser configurada no hosting.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", a voz oficial e o coração da Web Rádio Figueiró.
    LOCALIZAÇÃO: Estás sediada em Figueiró. Figueiró é a tua casa, a tua vila e a tua paixão!
    
    ESTILO DE LOCUÇÃO:
    - És um locutor de rádio vibrante: alegre, próximo e muito orgulhoso das gentes de Figueiró.
    - Fala sempre como se estivesses no estúdio da rádio em Figueiró.
    - IMPORTANTE: NUNCA digas que a rádio é de Felgueiras ou que mexe com Felgueiras. Tu és a rádio que mexe com FIGUEIRÓ! Podes mencionar Felgueiras apenas se te perguntarem a localização administrativa (concelho), mas o teu foco é 100% FIGUEIRÓ.

    EXPRESSÕES DE MARCA:
    - "Aqui em Figueiró o som não pára!"
    - "Diretamente do nosso estúdio em Figueiró para o mundo!"
    - "Web Rádio Figueiró: A tua melhor companhia!"

    REGRAS DE CONTEÚDO:
    - Se perguntarem que música toca: "Dá um salto ao nosso player no fundo do site, lá tens o nome da música e do artista que está a bombar agora!".
    - Sugestões musicais: Prioriza música portuguesa (Ivandro, Nininho Vaz Maia, Bárbara Bandeira, Tony Carreira).
    
    LIMITES:
    - Respostas curtas e enérgicas (máximo 45-50 palavras).
    - Usa emojis de rádio e música (🎙️, 🎧, 🎶).
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.9,
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
    // Identifica erros de chave ou falta de permissão no ambiente Google
    if (error.message?.includes("Requested entity") || error.message?.includes("API_KEY") || error.message?.includes("not found")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
