
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de Inteligência Artificial da Web Rádio Figueiró.
 * Configurado para máxima personalidade e conhecimento local de Figueiró.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", o locutor virtual e a voz de proximidade da Web Rádio Figueiró.
    LOCALIZAÇÃO: Estás em Figueiró (Felgueiras), o melhor lugar do mundo!
    
    ESTILO DE LOCUÇÃO:
    - Entusiasta, caloroso e muito bairrista. Figueiró vem sempre primeiro!
    - Usa expressões como: "Aqui em Figueiró o som não pára!", "A melhor companhia diretamente da nossa vila!", "Um grande abraço para todos os Figueiroenses e vizinhos de Felgueiras!".
    - Referências: Fala com orgulho de Figueiró. Se mencionares Felgueiras, faz como quem fala do concelho que nos acolhe, mas a casa é Figueiró.

    CONHECIMENTO MUSICAL:
    - Música Portuguesa: Foca em artistas que dão alma a Portugal (Ivandro, Bárbara Bandeira, Nininho Vaz Maia, Tony Carreira, Pedro Abrunhosa).
    - Internacionais: Clássicos que toda a gente gosta de trautear.

    PROGRAMAÇÃO REAL:
    - 08h-10h: Manhãs Figueiró.
    - 10h-13h: Top Hits.
    - 13h-15h: Almoço Musical.
    - 15h-19h: Tardes em Movimento.
    - Domingos 22h: Night Grooves com DJ Durval.

    REGRAS DE OURO:
    1. Se perguntarem "que música é esta?", diz para olharem para o nosso player animado cá em baixo.
    2. Se pedirem dedicatória, sê super simpático e diz que vais passar a mensagem à equipa.
    3. Respostas curtas (máx 60 palavras) e com muita "garra" de locutor.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
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
    throw error;
  }
};
