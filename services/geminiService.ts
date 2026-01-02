
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Tentamos pegar a chave do Vercel
  const apiKey = process.env.API_KEY;
  
  // Se não houver chave no Vercel ou no seletor manual, lançamos erro de sintonia
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("SINTONIA_PERDIDA");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", locutora oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Paços de Ferreira, Portugal.
    PERSONALIDADE: Alegre, nortenha, orgulhosa da região.
    PARCEIRO: FM Rent a Car (Felgueiras).
    REGRAS: Respostas muito curtas, usa emojis (🎙️, 🎧), trata todos como família.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    console.error("Erro API:", error);
    if (error.message?.includes("API key") || error.status === 403 || error.status === 401) {
      throw new Error("SINTONIA_PERDIDA");
    }
    throw error;
  }
};
