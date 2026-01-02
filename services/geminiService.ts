
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    /**
     * CONSTRUÇÃO DO CONTEÚDO PARA A API
     * 1. Filtramos o histórico para garantir que comece por 'user'
     * 2. Garantimos que role é 'user' ou 'model' (não 'assistant')
     */
    let filteredHistory = history
      .filter(msg => msg.text && msg.text.trim() !== "")
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // A API REJEITA se o histórico não começar por 'user'. 
    // Removemos mensagens do topo (como a saudação inicial do bot) até encontrarmos um 'user'.
    while (filteredHistory.length > 0 && filteredHistory[0].role !== 'user') {
      filteredHistory.shift();
    }

    // Adicionamos a mensagem atual do utilizador ao final
    const contents = [
      ...filteredHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    // Chamada direta ao generateContent (mais estável para ambientes serverless/vercel)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor virtual oficial da Web Rádio Figueiró. 
        Localização: Figueiró, Portugal. Hora atual: ${hora}:${min} (${diaSemana}).
        
        TONALIDADE:
        - Estilo locutor de rádio FM: enérgico, caloroso e muito "fixe".
        - Usa gíria de rádio portuguesa: "Sintonizados", "No ar", "Grande abraço musical", "Energia no máximo".
        - Sê breve (máximo 3 frases) e usa emojis: 🎙️🎵📻.
        
        CONTEÚDO:
        - Dedicatórias: Sê emotivo.
        - Pedidos de música: Sugere hits (Pimba, Pop Português, 80s).
        - Parceiros: Elogia sempre a FM Rent a Car & Bicycle House de Felgueiras.`,
        temperature: 1.0,
      },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("A API retornou uma resposta vazia.");
    
    return textOutput;

  } catch (error: any) {
    console.error("ERRO FIGUEIRÓ AI:", error);
    // Mensagem de fallback amigável
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi o sinal por um segundo, mas já estou aqui no ar!";
  }
};
