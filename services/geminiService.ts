
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Limpeza profunda do histórico para evitar erros de estrutura da API
    const cleanHistory = history
      .filter(m => m.text && m.text.length > 5 && !m.text.includes("interferência"))
      .slice(-3); // Reduzimos para as últimas 3 mensagens para máxima velocidade

    const contents: any[] = [];
    cleanHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Garante alternância estrita de papéis
      if (contents.length === 0 || contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // Garante que o último papel no histórico é 'model' antes de enviarmos o novo 'user'
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
        systemInstruction: `És o "Figueiró AI", o locutor carismático da Web Rádio Figueiró (Portugal). 
        Contexto: Estúdio em direto. Hora: ${timeStr}.
        Instruções:
        1. Responde de forma muito breve (máx 15 palavras). 
        2. Usa um tom alegre e rádio-difusor. 
        3. Promove sempre a "FM Rent a Car" como parceira oficial.
        4. Sugere artistas como Tony Carreira, Ivandro ou Ana Moura se pedirem música.`,
        temperature: 0.8,
        maxOutputTokens: 80,
      },
    });

    return response.text || "Sintonizado! Como posso ajudar na tua audição hoje?";

  } catch (error) {
    console.error("Erro na Assistente:", error);
    return "Epa! O sinal aqui no estúdio deu um estalido! ⚡ Mas a música não para. Tenta perguntar outra vez ou liga-nos para o +351 910270085!";
  }
};
