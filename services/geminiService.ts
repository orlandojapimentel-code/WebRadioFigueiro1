
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço ultra-estável para a Web Rádio Figueiró.
 * Focado em simplicidade para evitar erros de conexão.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  try {
    // Inicializa a IA com a chave de ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Chamada direta e limpa para evitar problemas de memória/contexto
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "És o animador da Web Rádio Figueiró. Responde sempre de forma muito curta (máx 15 palavras), alegre e usa gíria de rádio como 'estamos juntos' ou 'grande abraço'.",
        temperature: 0.8,
      },
    });

    let textAcumulado = "";
    
    // Processa cada pedaço da resposta assim que chega
    for await (const chunk of response) {
      const parteTexto = chunk.text;
      if (parteTexto) {
        textAcumulado += parteTexto;
        onChunk(textAcumulado);
      }
    }

    return textAcumulado;

  } catch (error: any) {
    // Log detalhado no console para ajudar a identificar o problema real (ex: chave inválida)
    console.error("ERRO DE ESTÚDIO:", error.message || error);
    throw error;
  }
};
