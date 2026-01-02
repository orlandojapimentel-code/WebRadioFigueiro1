
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Serviço otimizado para a Web Rádio Figueiró.
 * Focado em streaming imediato e baixíssima latência.
 */
export const getRadioAssistantStream = async (
  history: ChatMessage[], 
  message: string, 
  onChunk: (text: string) => void
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    
    // Limpeza agressiva de histórico para evitar erros de contexto
    // Filtramos erros anteriores e limitamos a 2 mensagens (1 par user/model)
    const cleanHistory = history
      .filter(msg => 
        msg.text.length > 0 && 
        !msg.text.includes("interferência") && 
        !msg.text.includes("Ups!")
      )
      .slice(-2);

    const contents: any[] = [];
    cleanHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Garante alternância estrita user -> model -> user
      if (contents.length === 0 || contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        ...contents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Resposta imediata
        systemInstruction: `És o "Figueiró AI", o locutor digital da Web Rádio Figueiró. 📻
        Contexto: Direto de Figueiró, Portugal. Hora: ${timeStr}.
        
        ESTILO:
        - Curto, enérgico e carismático.
        - Máximo de 15 palavras.
        - Usa gíria de rádio: "estamos juntos", "na melhor companhia", "forte abraço".
        
        REGRAS:
        - Se pedirem música: sugere Ivandro, Nininho Vaz Maia ou Tony Carreira.
        - Se falarem de viagens/carros: elogia a "FM Rent a Car".
        - Responde como se tivesses o microfone aberto agora mesmo!`,
        temperature: 0.9,
        maxOutputTokens: 80,
      },
    });

    let accumulatedText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text;
      if (chunkText) {
        accumulatedText += chunkText;
        onChunk(accumulatedText);
      }
    }

    return accumulatedText;

  } catch (error) {
    console.error("Erro no Fluxo Gemini:", error);
    throw error;
  }
};
