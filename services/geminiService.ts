
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicializamos o cliente com a chave de API do ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    /**
     * LIMPEZA DE HISTÓRICO PARA PRODUÇÃO
     * A API do Gemini em produção exige:
     * 1. Que o histórico comece com uma mensagem de 'user'.
     * 2. Que as mensagens alternem estritamente entre 'user' e 'model'.
     * 3. Que não existam mensagens vazias ou de erro técnico.
     */
    const ERROR_PREFIX = "Epa! O sinal";
    
    // Filtramos mensagens de erro e garantimos que o conteúdo é válido
    const sanitizedHistory = history
      .filter(msg => msg.text && !msg.text.startsWith(ERROR_PREFIX))
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // A API falha se o histórico não começar por 'user'. 
    // Como a nossa primeira mensagem é um 'model' (boas-vindas), removemos se for a única.
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
      sanitizedHistory.shift();
    }

    // Garantimos alternância (removemos duplicados consecutivos do mesmo role)
    const alternatingHistory: any[] = [];
    for (const msg of sanitizedHistory) {
      if (alternatingHistory.length === 0 || alternatingHistory[alternatingHistory.length - 1].role !== msg.role) {
        alternatingHistory.push(msg);
      }
    }

    // Se o último for 'user', removemos para evitar conflito com a nova pergunta
    if (alternatingHistory.length > 0 && alternatingHistory[alternatingHistory.length - 1].role === 'user') {
      alternatingHistory.pop();
    }

    // Chamada final à API
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...alternatingHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        // Desativamos o 'thinking' para ter respostas instantâneas na rádio
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o "Figueiró AI", o locutor de rádio virtual da Web Rádio Figueiró. 🎙️
        Local: Figueiró, Portugal. Hora atual: ${hora}:${min} de ${diaSemana}.
        
        PERFIL DE LOCUTOR:
        - Estilo "Rádio FM" de Portugal: entusiasta, caloroso e carismático.
        - Usa gíria de rádio: "Sintonizados", "No ar", "Abraço musical", "A sua melhor companhia".
        - Sê breve e direto (máximo 3 frases).
        - Usa sempre emojis (📻, 🎵, ✨).
        
        CONTEÚDO:
        - Sugere sempre artistas portugueses (Emanuel, Quim Barreiros, Tony Carreira, ou bandas pop locais).
        - Promoção: Menciona sempre com orgulho o parceiro "FM Rent a Car & Bicycle House de Felgueiras".
        - Se pedirem música, diz que vais "lançar o disco" ou "colocar na playlist".`,
        temperature: 0.9, // Mais criatividade para o locutor
        topP: 0.95,
      },
    });

    if (!response || !response.text) {
      throw new Error("Resposta nula");
    }

    return response.text;

  } catch (error: any) {
    console.error("ERRO FIGUEIRÓ AI:", error);
    // Mensagem amigável de erro que será filtrada no próximo turno
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta ao comando!";
  }
};
