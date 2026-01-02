
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Serviço de IA Ultra-Rápido para Web Rádio Figueiró.
 * Configurado para latência mínima e máxima estabilidade.
 */
export const getRadioAssistantStream = async (
  history: ChatMessage[], 
  message: string, 
  onChunk: (text: string) => void
) => {
  try {
    // Inicialização direta para garantir o uso da chave mais recente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    
    // FILTRAGEM AGRESSIVA: Removemos qualquer mensagem de erro do histórico para não "contaminar" a IA
    const cleanHistory = history
      .filter(msg => 
        msg.text.length > 0 && 
        !msg.text.includes("interferência") && 
        !msg.text.includes("Ups!") &&
        !msg.text.includes("sinal falhou")
      )
      .slice(-2); // Apenas as últimas 2 mensagens para garantir resposta instantânea

    const contents: any[] = [];
    cleanHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Garantia de alternância obrigatória exigida pela API
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
        // O segredo da velocidade: orçamento de pensamento ZERO
        thinkingConfig: { thinkingBudget: 0 }, 
        systemInstruction: `És o locutor de serviço da Web Rádio Figueiró. 🎙️
        Contexto: Estúdio principal em Figueiró. Hora atual: ${timeStr}.
        Personalidade: Curto, direto, voz de rádio, muito animado.
        
        REGRAS DE OURO:
        - Máximo de 12 palavras por resposta.
        - Nunca uses listas.
        - Usa frases como: "Estamos juntos!", "Na melhor companhia!", "Grande abraço ouvinte!".
        - Se pedirem música: sugere Ivandro, Tony Carreira ou Nininho Vaz Maia.
        - Se falarem de carros: menciona a "FM Rent a Car".`,
        temperature: 1, // Mais criativo e natural
        maxOutputTokens: 60, // Respostas curtas carregam mais depressa
      },
    });

    let fullResponse = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullResponse += chunkText;
        onChunk(fullResponse);
      }
    }

    return fullResponse;

  } catch (error) {
    console.error("Erro crítico no assistente:", error);
    throw error;
  }
};
