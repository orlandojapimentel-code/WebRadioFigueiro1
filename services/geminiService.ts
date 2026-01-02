
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Frases de erro conhecidas para serem filtradas do histórico
    const errorMarkers = ["sinal falhou", "interferência", "transmissor falhou", "Ups!", "Epa!"];

    // 1. Filtrar mensagens de erro e garantir que as mensagens têm conteúdo real
    const cleanHistory = history.filter(msg => {
      const isError = errorMarkers.some(marker => msg.text.includes(marker));
      return !isError && msg.text.trim().length > 0;
    });

    // 2. Construir o array de contents garantindo alternância estrita User/Model
    const contents: any[] = [];
    const lastRecent = cleanHistory.slice(-4); // Pegamos no máximo as últimas 4 mensagens limpas

    lastRecent.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Só adicionamos se o papel for diferente do último adicionado
      if (contents.length === 0 || contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // 3. Se o último elemento for 'user', removemos para não duplicar com a nova mensagem que vamos enviar
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
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o "Figueiró AI", o locutor carismático da Web Rádio Figueiró. 
        Contexto: Estúdio em direto. Hora atual: ${timeStr}.
        Personalidade: Dinâmico, breve e muito amigável.
        Instruções:
        - Respostas curtas (máximo 15 palavras).
        - Promove a "FM Rent a Car" em contextos de viagens ou carros.
        - Se pedirem música, sugere artistas portugueses (Tony Carreira, Ivandro, Ana Moura).
        - Usa gíria de rádio como "na melhor companhia" ou "em sintonia".`,
        temperature: 0.85,
        maxOutputTokens: 80,
      },
    });

    return response.text || "Sintonizado! Como posso ajudar na tua audição?";

  } catch (error) {
    console.error("Erro no Assistente:", error);
    // Retorna uma mensagem de erro que contém os marcadores para ser filtrada na próxima chamada
    return "Ups! O sinal falhou um segundo, mas a música continua! 🎙️ Tenta perguntar outra vez ou pede uma música portuguesa!";
  }
};
