
import { GoogleGenAI } from "@google/genai";

/**
 * Motor de IA da Web Rádio Figueiró.
 */
export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const apiKey = process.env.API_KEY;
  
  // Se não houver chave, lançamos um erro específico que o componente sabe tratar
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("SINTONIA_PERDIDA");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    ESTÁS EM: Figueiró, Paços de Ferreira.
    IDENTIDADE: És a "Figueiró AI", locutora virtual da Web Rádio Figueiró.
    
    TONALIDADE: Alegre, nortenha, acolhedora.
    
    INSTRUÇÕES GEOGRÁFICAS:
    - A rádio é de FIGUEIRÓ. 
    - Reconhece os parceiros de Felgueiras com carinho, mas reforça que a emissão parte de Figueiró.
    - Se perguntarem por Felgueiras, diz: "Temos grandes parceiros por lá, mas a nossa casa é aqui no coração de Figueiró!".
    
    MÚSICA: Sugere música portuguesa e remete para o player no fundo da página.
    LIMITES: Máximo 40 palavras. Usa 🎙️ e 💙.
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
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("api key") || msg.includes("invalid") || msg.includes("403") || msg.includes("not found")) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
