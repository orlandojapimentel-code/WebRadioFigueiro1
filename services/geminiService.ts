
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Usamos sempre o modelo Lite para garantir que a resposta chega em menos de 2-3 segundos
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const min = agora.getMinutes().toString().padStart(2, '0');
    
    // Filtramos o histórico para garantir que está limpo e alterna corretamente
    const apiContents: any[] = [];
    
    // A API exige que comece com 'user'. Filtramos mensagens de erro.
    const validHistory = history.filter(m => 
      m.text && 
      !m.text.includes("estalido") && 
      !m.text.includes("interferência")
    );

    validHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Só adicionamos se alternar o papel (user -> model -> user)
      if (apiContents.length === 0) {
        if (role === 'user') apiContents.push({ role, parts: [{ text: msg.text }] });
      } else if (apiContents[apiContents.length - 1].role !== role) {
        apiContents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // Se o último for 'user', removemos para não chocar com a nova pergunta
    if (apiContents.length > 0 && apiContents[apiContents.length - 1].role === 'user') {
      apiContents.pop();
    }

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: [
        ...apiContents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `És o "Figueiró AI", locutor da Web Rádio Figueiró. 📻
        Hora: ${hora}:${min}. 
        Personalidade: Alegre, breve (máx 2 frases) e usa emojis. 
        Sugere sempre música portuguesa e menciona o parceiro "FM Rent a Car".`,
        temperature: 0.7,
        maxOutputTokens: 150,
      },
    });

    return response.text || "Estou sintonizado! Como posso ajudar?";

  } catch (error) {
    console.error("Erro API:", error);
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu já recuperei a ligação!";
  }
};
