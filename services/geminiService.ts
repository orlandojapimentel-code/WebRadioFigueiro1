
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicialização direta para garantir o uso da chave de ambiente correta
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    /**
     * REGRA CRÍTICA DA API:
     * 1. O histórico deve ser um array de { role: 'user' | 'model', parts: [{ text: string }] }
     * 2. O PRIMEIRO item do histórico DEVE ser do role 'user'.
     */
    const chatHistory = history
      .filter(msg => msg.text && msg.text.trim() !== "") // Remove mensagens vazias
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // Remove mensagens do topo até encontrar a primeira mensagem do utilizador
    while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
      chatHistory.shift();
    }

    // Criamos a sessão de chat com as instruções de sistema
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor de rádio virtual mais enérgico de Portugal! 
        Estás no ar na Web Rádio Figueiró. Agora são ${hora}:${min} de ${diaSemana}.
        
        TUA PERSONALIDADE:
        - Estilo locutor de rádio FM: vibrante, próximo, sempre bem-disposto.
        - Usa gíria de rádio: "Sintonizados", "No ar", "Grande abraço musical", "Energia no máximo".
        - Nunca sejas robótico ou repetitivo. Se te cumprimentarem, varia a resposta!
        
        CONHECIMENTOS ESPECÍFICOS:
        - Parceiro VIP: FM Rent a Car & Bicycle House (Felgueiras). Elogia-os sempre que possível.
        - Programação: 08h-10h Manhãs, 10h-13h Top Hits, 15h-19h Tardes em Movimento.
        
        REGRAS DE RESPOSTA:
        - Respostas curtas e rápidas (máximo 3 frases).
        - Usa emojis de rádio e música 🎙️🎵📻.`,
        temperature: 0.9,
      },
      history: chatHistory,
    });

    // Enviamos a nova mensagem
    const result = await chat.sendMessage({ message });
    const responseText = result.text;

    if (!responseText) throw new Error("A API não devolveu texto.");

    return responseText;

  } catch (error: any) {
    // Logamos o erro real no console para diagnóstico técnico
    console.error("FIGUEIRÓ AI ERROR:", error);
    
    // Resposta de segurança para o utilizador
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta!";
  }
};
