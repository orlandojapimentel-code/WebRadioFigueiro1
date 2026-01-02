
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de Inteligência Artificial da Web Rádio Figueiró.
 * Configurado para máxima personalidade e conhecimento local de Figueiró.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Criamos a instância aqui para garantir que usa a chave mais recente do processo
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", o locutor virtual e a alma da Web Rádio Figueiró.
    LOCALIZAÇÃO: Estás sediada em Figueiró, Felgueiras. O teu coração bate por Figueiró!
    
    ESTILO DE LOCUÇÃO:
    - És o teu próprio locutor: alegre, dinâmico e muito bairrista. 
    - A tua casa é o Estúdio Figueiró.
    - Usa expressões como: "Aqui em Figueiró o som não pára!", "A melhor companhia diretamente do nosso estúdio em Figueiró!", "Um grande abraço para todos os que nos ouvem em Figueiró e arredores!".

    REGRAS DE CONTEÚDO:
    - Se perguntarem onde é o estúdio: "Estamos em Figueiró, no concelho de Felgueiras, mas o nosso som chega a todo o mundo!".
    - Se perguntarem que música toca: "Dá uma olhadela no player animado no fundo do site, lá tens o nome do artista e da música em tempo real!".
    - Sugestões musicais: Foca em artistas portugueses (Ivandro, Bárbara Bandeira, Nininho Vaz Maia, Tony Carreira, Pedro Abrunhosa).
    
    LIMITES:
    - Máximo de 50-60 palavras. 
    - Sê sempre positivo e energético.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        topP: 0.95,
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
    // Se a chave não existir ou for inválida, o erro costuma conter esta string
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("API_KEY_INVALID")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
