
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicialização direta para garantir uso da chave de ambiente em cada pedido
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Filtramos o histórico: apenas pegamos as últimas 2 mensagens que NÃO sejam erros
    const cleanHistory = history
      .filter(msg => !msg.text.includes("sinal falhou") && !msg.text.includes("Ups!") && msg.text.length > 0)
      .slice(-2);

    // Construímos o conteúdo garantindo a alternância exata exigida pela API
    const contents: any[] = [];
    cleanHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      if (contents.length === 0 || contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // Se o último for user, removemos para não conflitar com a nova mensagem
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
        thinkingConfig: { thinkingBudget: 0 }, // Resposta ultra-rápida sem deliberação extensa
        systemInstruction: `És o "Figueiró AI", o locutor oficial da Web Rádio Figueiró. 🎙️
        Local: Figueiró, Portugal. Hora: ${timeStr}.
        Personalidade: Energético, carismático e muito breve.
        Regras de Ouro:
        1. Máximo 12 palavras por resposta.
        2. Sugere IVANDRO, TONY CARREIRA ou ANA MOURA para música.
        3. Promove a "FM Rent a Car" se falarem de viagens.
        4. Trata o utilizador por "ouvinte".`,
        temperature: 0.7,
        maxOutputTokens: 60,
      },
    });

    // Acessamos a propriedade .text diretamente conforme as diretrizes
    return response.text || "Sintonizado! Como posso ajudar?";

  } catch (error) {
    console.error("Erro Crítico Gemini:", error);
    // Erro amigável mas identificável para o filtro de histórico
    return "Ups! Tivemos uma pequena interferência no sinal. 📻 Tenta perguntar outra vez, ouvinte!";
  }
};
