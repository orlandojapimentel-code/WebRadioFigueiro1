
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
     * LIMPEZA DE HISTÓRICO PARA PRODUÇÃO
     * 1. Removemos mensagens de erro/fallback do histórico.
     * 2. Garantimos que o histórico começa com 'user'.
     * 3. Garantimos alternância estrita User -> Model.
     */
    const ERROR_PREFIX = "Epa! O sinal aqui no estúdio digital";
    
    let sanitizedHistory = history
      .filter(msg => msg.text && !msg.text.startsWith(ERROR_PREFIX))
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // Regra de Ouro da API: O histórico tem de começar com uma mensagem do 'user'
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
      sanitizedHistory.shift();
    }

    // Garantir alternância (remove mensagens duplicadas do mesmo autor se houver erros de rede)
    const alternatingHistory: any[] = [];
    for (const msg of sanitizedHistory) {
      if (alternatingHistory.length === 0 || alternatingHistory[alternatingHistory.length - 1].role !== msg.role) {
        alternatingHistory.push(msg);
      }
    }

    // Se o último for 'user', removemos porque vamos anexar a nova mensagem como 'user'
    if (alternatingHistory.length > 0 && alternatingHistory[alternatingHistory.length - 1].role === 'user') {
      alternatingHistory.pop();
    }

    // Montagem final do payload
    const contents = [
      ...alternatingHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor de rádio virtual oficial da Web Rádio Figueiró. 
        Localização: Figueiró, Portugal. Hora: ${hora}:${min} (${diaSemana}).
        
        TONALIDADE E REGRAS:
        - Estilo locutor de rádio FM de Portugal (Português de Portugal).
        - Usa gíria de rádio: "Sintonizados", "No ar", "Abraço musical", "Energia no máximo".
        - Sê muito breve (máximo 3 frases) e caloroso. Usa emojis: 🎙️📻🎵✨.
        
        CONHECIMENTOS:
        - Pedidos de música: Sugere hits (Pimba, Pop Português, 80s).
        - Parceiros: Elogia sempre a "FM Rent a Car & Bicycle House de Felgueiras" como o parceiro oficial.
        - Dedicatórias: Sê emotivo e profissional.`,
        temperature: 1.0,
      },
    });

    if (!response || !response.text) {
      throw new Error("Resposta vazia da API");
    }

    return response.text;

  } catch (error: any) {
    console.error("ERRO FIGUEIRÓ AI:", error);
    // Retornamos a mensagem de fallback que o utilizador viu na imagem 2
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta ao comando!";
  }
};
