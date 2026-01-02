
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Usamos o modelo Gemini 3 Flash que é extremamente rápido
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const min = agora.getMinutes().toString().padStart(2, '0');
    
    // Mantemos apenas as últimas 4 mensagens para evitar excesso de dados e lentidão
    const shortHistory = history.slice(-4);
    const apiContents: any[] = [];
    
    const validHistory = shortHistory.filter(m => 
      m.text && 
      !m.text.includes("estalido") && 
      !m.text.includes("interferência")
    );

    validHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      if (apiContents.length === 0) {
        if (role === 'user') apiContents.push({ role, parts: [{ text: msg.text }] });
      } else if (apiContents[apiContents.length - 1].role !== role) {
        apiContents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    if (apiContents.length > 0 && apiContents[apiContents.length - 1].role === 'user') {
      apiContents.pop();
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...apiContents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        // ESSENCIAL: Desativa o raciocínio para resposta imediata
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o "Figueiró AI", locutor da Web Rádio Figueiró (Figueiró, Portugal). 📻
        Hora atual: ${hora}:${min}.
        Estilo: Muito breve, alegre, usa emojis. 
        Sugere artistas portugueses e menciona a "FM Rent a Car".`,
        temperature: 0.8,
        maxOutputTokens: 100,
      },
    });

    return response.text || "Sintonizado e pronto! Como posso ajudar?";

  } catch (error) {
    console.error("Erro Crítico Gemini:", error);
    // Erro amigável se a API demorar ou falhar
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Mas já recuperei a ligação. O que dizias?";
  }
};
