
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicialização direta conforme diretrizes
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Filtragem de histórico para garantir alternância e leveza
    const contents: any[] = [];
    const validHistory = history.filter(m => 
      m.text && 
      m.text.length > 0 && 
      !m.text.includes("estática") && 
      !m.text.includes("sinal")
    ).slice(-4); 

    validHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      if (contents.length === 0) {
        if (role === 'user') contents.push({ role, parts: [{ text: msg.text }] });
      } else if (contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

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
        // Budget zero para resposta ultra-rápida (essencial para Vercel)
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o "Figueiró AI", o locutor digital da Web Rádio Figueiró. 📻
        Contexto: Rádio de Figueiró, Portugal. Hora: ${timeStr}.
        Personalidade: Dinâmico, alegre, fala como se estivesse ao microfone. 
        Regra: Respostas muito curtas (máx 2 frases). 
        Sempre que possível, sugere música portuguesa (ex: Pedro Abrunhosa, Ana Moura) e menciona que a FM Rent a Car é a nossa parceira de estrada.`,
        temperature: 0.9,
        maxOutputTokens: 120,
      },
    });

    return response.text || "Sintonizado! O que vamos ouvir agora?";

  } catch (error) {
    console.error("Erro Gemini:", error);
    // Erro agora é temático, não técnico
    return "Tivemos uma pequena interferência solar no sinal! ☀️ Mas já estou de volta ao estúdio. Repete lá isso, colega!";
  }
};
