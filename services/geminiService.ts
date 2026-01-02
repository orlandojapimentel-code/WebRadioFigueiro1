
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicializamos o cliente dentro da função para garantir que usa a chave mais recente do ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Simplificamos o histórico para as últimas 2 interações para máxima performance e evitar erros de estrutura
    const recentHistory = history.slice(-2);
    const contents: any[] = [];

    recentHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Garante a alternância obrigatória entre 'user' e 'model'
      if (contents.length === 0 || contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // Se o histórico terminar em 'user', removemos para não colidir com a nova mensagem
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents.pop();
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...contents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Desativa o raciocínio complexo para resposta instantânea
        systemInstruction: `És o "Figueiró AI", o locutor de rádio mais fixe de Portugal. 
        Contexto: Web Rádio Figueiró. Estúdio em direto. Hora: ${timeStr}.
        Objetivo: Responder de forma curta (máx 15 palavras), alegre e profissional. 
        - Sugere sempre música portuguesa se pedirem música.
        - Se mencionarem carros ou viagens, fala da nossa parceira "FM Rent a Car".
        - Usa gíria de rádio: "estamos juntos", "na melhor companhia", "grande abraço".`,
        temperature: 0.8,
        maxOutputTokens: 100,
      },
    });

    return response.text || "Sintonizado! Como posso ajudar na tua audição hoje?";

  } catch (error) {
    console.error("Erro na Assistente Figueiró:", error);
    // Mensagem de erro mais discreta e útil
    return "Ups! O sinal falhou um segundo, mas a música continua! 🎙️ Tenta perguntar outra vez ou pede uma música portuguesa!";
  }
};
