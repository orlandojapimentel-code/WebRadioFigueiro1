
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Nova instância para garantir o uso da API KEY atualizada
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    const ERROR_PREFIX = "Epa! O sinal";

    /**
     * LIMPEZA E FORMATAÇÃO DO HISTÓRICO
     * A API exige estritamente: USER -> MODEL -> USER...
     */
    const apiContents: any[] = [];

    const filteredHistory = history.filter(msg => 
      msg.text && 
      !msg.text.startsWith(ERROR_PREFIX) &&
      msg.text.trim() !== ""
    );

    filteredHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      
      if (apiContents.length === 0) {
        if (role === 'user') {
          apiContents.push({ role, parts: [{ text: msg.text }] });
        }
      } else {
        const lastRole = apiContents[apiContents.length - 1].role;
        if (role !== lastRole) {
          apiContents.push({ role, parts: [{ text: msg.text }] });
        }
      }
    });

    // Se o histórico terminar em 'user', removemos para não duplicar com a nova pergunta
    if (apiContents.length > 0 && apiContents[apiContents.length - 1].role === 'user') {
      apiContents.pop();
    }

    // Chamada otimizada para VELOCIDADE
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...apiContents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        // DESATIVAR O THINKING é crucial para evitar o timeout do Vercel
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o "Figueiró AI", o locutor virtual da Web Rádio Figueiró (Figueiró, Portugal). 📻
        
        CONTEXTO ATUAL:
        - Hora: ${hora}:${min} de ${diaSemana}.
        - Estilo: Rádio FM profissional, alegre e próximo dos ouvintes.
        - Idioma: Português de Portugal (PT-PT).
        
        REGRAS:
        1. Sê breve (máximo 3 frases).
        2. Usa sempre emojis (🎙️, 🎵, ✨).
        3. Sugere artistas portugueses (Ex: Tony Carreira, Emanuel, Calema, Mariza).
        4. Menciona o parceiro "FM Rent a Car & Bicycle House de Felgueiras".`,
        temperature: 0.9,
        maxOutputTokens: 300,
      },
    });

    if (!response || !response.text) {
      throw new Error("Resposta inválida");
    }
    
    return response.text;

  } catch (error: any) {
    console.error("ERRO FIGUEIRÓ AI:", error);
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta ao comando!";
  }
};
