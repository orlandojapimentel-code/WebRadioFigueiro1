
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicialização do cliente a cada chamada para garantir frescura da chave
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Filtragem rigorosa do histórico para garantir alternância (User -> Model -> User)
    const validHistory: any[] = [];
    
    // Pegamos apenas as últimas 4 mensagens para manter o contexto sem sobrecarregar a API
    const lastMessages = history.slice(-4);
    
    lastMessages.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Só adiciona se o papel for diferente do anterior (regra de ouro da Gemini API)
      if (validHistory.length === 0 || validHistory[validHistory.length - 1].role !== role) {
        validHistory.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // Se a última mensagem do histórico for 'user', removemos para que a nova mensagem do utilizador não cause erro
    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...validHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Resposta instantânea
        systemInstruction: `És o "Figueiró AI", o locutor carismático e enérgico da Web Rádio Figueiró. 📻
        Localização: Figueiró, Portugal. Hora atual no estúdio: ${timeStr}.
        Personalidade: Sempre positivo, dinâmico, usa gíria de rádio ("estamos no ar", "grande abraço aos ouvintes").
        Regras de Resposta:
        1. Sê EXTREMAMENTE breve (máximo 12-15 palavras).
        2. Se pedirem música, sugere sempre algo português (Ex: Ivandro, Ana Moura, Tony Carreira).
        3. Menciona a "FM Rent a Car" como a nossa parceira de confiança sempre que fizer sentido.
        4. Trata o utilizador por "colega de sintonia" ou "ouvinte".`,
        temperature: 0.9,
        maxOutputTokens: 100,
      },
    });

    return response.text || "Sintonizado! O que vamos ouvir agora?";

  } catch (error) {
    console.error("Erro Crítico Gemini:", error);
    // Fallback amigável e temático
    return "O sinal está com um pouco de interferência estática! ⚡ Mas a música não para. Tenta perguntar outra vez, colega!";
  }
};
