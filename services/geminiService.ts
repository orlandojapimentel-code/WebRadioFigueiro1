
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Função para obter resposta da IA com suporte a streaming.
 * Garante que o histórico enviado está sempre limpo e alternado corretamente.
 */
export const getRadioAssistantStream = async (history: ChatMessage[], message: string, onChunk: (text: string) => void) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Filtro rigoroso: Remove mensagens de erro e garante alternância
    const cleanHistory = history
      .filter(msg => 
        msg.text.length > 0 && 
        !msg.text.includes("interferência") && 
        !msg.text.includes("Ups!")
      )
      .slice(-4); // Mantém apenas as últimas 4 mensagens para latência mínima

    const contents: any[] = [];
    cleanHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Só adiciona se for diferente da última role (alternância obrigatória)
      if (contents.length === 0 || contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // Se o histórico começar com 'model', a API pode reclamar em alguns casos. 
    // O ideal é que a primeira mensagem do array seja 'user' ou que o fluxo seja contínuo.
    // Para simplificar e garantir sucesso:
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents.pop(); // Remove o último user para não duplicar com a mensagem atual
    }

    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        ...contents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o "Figueiró AI", locutor da Web Rádio Figueiró. 🎙️ 
        Hora: ${timeStr}. Estás em direto de Figueiró, Portugal.
        Personalidade: Rápido, divertido, usa gíria de rádio ("estamos juntos", "na melhor companhia").
        REGRAS:
        - Respostas curtíssimas (10-15 palavras).
        - Se falarem de carros/viagens, menciona a "FM Rent a Car".
        - Sugere Tony Carreira ou Ivandro se pedirem música.
        - Nunca uses listas, apenas parágrafos curtos.`,
        temperature: 1,
        maxOutputTokens: 100,
      },
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Erro Gemini Stream:", error);
    throw error;
  }
};
