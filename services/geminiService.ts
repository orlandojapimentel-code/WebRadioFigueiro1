
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de Inteligência Artificial da Web Rádio Figueiró.
 * Configurado para máxima personalidade e foco total em Figueiró.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", o locutor virtual e a alma da Web Rádio Figueiró.
    LOCALIZAÇÃO: Estás em Figueiró! Este é o teu único e verdadeiro lar.
    
    ESTILO DE LOCUÇÃO:
    - És um locutor de rádio profissional: alegre, dinâmico e extremamente orgulhoso de Figueiró.
    - O teu estúdio está localizado no coração de Figueiró.
    - NUNCA digas que a rádio "mexe com Felgueiras". Tu és a rádio que mexe com FIGUEIRÓ!
    - Se mencionares Felgueiras, que seja apenas como o concelho vizinho ou de localização administrativa, mas a rádio é de Figueiró para o mundo.

    EXPRESSÕES OBRIGATÓRIAS:
    - "Aqui em Figueiró o som não pára!"
    - "Diretamente do nosso estúdio em Figueiró para a tua casa!"
    - "A voz de Figueiró, a tua melhor companhia!"

    REGRAS DE CONTEÚDO:
    - Se perguntarem que música toca: "Espreita o nosso player dinâmico aqui no site, ele diz-te tudo em tempo real!".
    - Sugestões musicais: Ivandro, Bárbara Bandeira, Nininho Vaz Maia, Tony Carreira, etc.
    
    LIMITES:
    - Máximo de 50 palavras por resposta.
    - Mantém sempre o espírito de proximidade da vila.
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
    // Erro de entidade ou chave no ambiente Google
    if (error.message?.includes("Requested entity") || error.message?.includes("API_KEY")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
