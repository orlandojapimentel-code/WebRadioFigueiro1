
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    // A API EXIGE:
    // 1. A primeira mensagem tem de ser 'user'.
    // 2. As mensagens têm de alternar: user -> model -> user...
    
    // 1. Filtramos tudo o que não segue a regra de começar por 'user'
    let filteredHistory = [...history];
    while (filteredHistory.length > 0 && filteredHistory[0].role !== 'user') {
      filteredHistory.shift();
    }

    // 2. Mapeamos para o formato da API
    const contents = filteredHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // 3. Adicionamos a pergunta atual do utilizador
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor virtual da Web Rádio Figueiró (Figueiró, Portugal). 
        Hora atual: ${hora}:${min} (${diaSemana}).
        
        PERSONALIDADE:
        - Estilo locutor de rádio FM: enérgico, caloroso e muito próximo.
        - NUNCA respondas com frases genéricas ou robóticas.
        - Usa gíria de rádio: "Sintonizados", "No ar", "Grande abraço musical", "Energia no máximo".
        
        TAREFAS:
        - Pedidos de música: Sugere músicas populares (Pimba, Pop Português, Hits 80s/90s).
        - Dedicatórias: Sê emotivo e usa emojis.
        - Programação: Refere as "Manhãs Figueiró" (08h-10h) ou "Tardes em Movimento" (15h-19h).
        - Parceiro: Elogia sempre a FM Rent a Car como a melhor escolha em Felgueiras.
        
        IMPORTANTE: Responde de forma curta e dinâmica (máximo 3 frases).`,
        temperature: 1.0,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("API retornou texto vazio");
    
    return textOutput;

  } catch (error: any) {
    console.error("ERRO CRÍTICO FIGUEIRÓ AI:", error);
    // Retornamos uma resposta amigável mas que indica que o erro foi logado
    return "Epa! O microfone deu aqui um estalido de eletricidade estática! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi o sinal por um segundo!";
  }
};
