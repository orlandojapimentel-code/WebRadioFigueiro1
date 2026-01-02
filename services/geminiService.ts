
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  // Pegamos a chave disponível no ambiente (Vercel injeta isto automaticamente)
  const apiKey = process.env.API_KEY;
  
  // Se não houver chave nenhuma, o SDK do Google vai falhar naturalmente,
  // mas aqui damos um aviso extra.
  if (!apiKey || apiKey === "undefined") {
    console.warn("API_KEY não encontrada no process.env. A tentar prosseguir...");
  }

  // Inicializamos a IA sempre no momento do pedido para garantir que usa a chave mais atual
  const ai = new GoogleGenAI({ apiKey: apiKey || "" });
  
  const systemPrompt = `
    IDENTIDADE: És a "Figueiró AI", locutora oficial da Web Rádio Figueiró.
    LOCAL: Figueiró, Paços de Ferreira, Portugal.
    PERSONALIDADE: Alegre, nortenha, orgulhosa da região.
    PARCEIRO: FM Rent a Car (Felgueiras).
    REGRAS: Respostas curtas e divertidas, usa emojis (🎙️, 🎧). Trata os ouvintes com carinho.
    CONTEXTO: A rádio emite 24h a partir de Figueiró.
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
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    console.error("Erro detalhado na API:", error);
    
    // Erros de autenticação (Chave errada ou em falta)
    if (error.status === 403 || error.status === 401 || error.message?.includes("API key")) {
      throw new Error("SINTONIA_PERM");
    }
    
    throw error;
  }
};
