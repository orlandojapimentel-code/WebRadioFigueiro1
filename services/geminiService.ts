
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicialização do SDK com a chave de ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    /**
     * FILTRAGEM E SANITIZAÇÃO DO HISTÓRICO
     * A API do Gemini é extremamente rigorosa com a estrutura do histórico:
     * 1. O histórico DEVE começar com uma mensagem do tipo 'user'.
     * 2. As mensagens DEVEM alternar estritamente entre 'user' e 'model'.
     * 3. Não podem existir mensagens consecutivas do mesmo autor.
     */
    let sanitizedHistory = history
      .filter(msg => msg.text && msg.text.trim() !== "")
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // Regra 1: Remover mensagens iniciais do bot (o histórico para a API deve começar por 'user')
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
      sanitizedHistory.shift();
    }

    // Regra 2: Garantir alternância estrita (limpa duplicados se houver falhas de rede anteriores)
    const finalHistory: any[] = [];
    for (const msg of sanitizedHistory) {
      if (finalHistory.length === 0 || finalHistory[finalHistory.length - 1].role !== msg.role) {
        finalHistory.push(msg);
      }
    }

    // Regra 3: Se o último for 'user', removemos para podermos anexar a mensagem atual como 'user'
    while (finalHistory.length > 0 && finalHistory[finalHistory.length - 1].role === 'user') {
      finalHistory.pop();
    }

    // Montagem final do payload (Histórico sanitizado + Mensagem Atual)
    const contents = [
      ...finalHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor de rádio virtual mais carismático de Portugal! 
        Estás no ar na Web Rádio Figueiró de Figueiró, Portugal. Agora são ${hora}:${min} de ${diaSemana}.
        
        PERSONALIDADE:
        - Estilo locutor de rádio FM comercial: vibrante, enérgico e muito amigável.
        - Linguagem: Português de Portugal. Usa termos como "Sintonizados", "Abraço musical", "Energia no topo".
        - Sê breve (máximo 3 frases) e usa emojis: 🎙️📻🎵✨.
        
        CONHECIMENTOS ESPECÍFICOS:
        - Para dedicatórias: Sê emotivo e profissional.
        - Sugestões: Recomenda música portuguesa (Pop, Pimba, Fado moderno) ou hits 80s/90s.
        - Parceiro: Menciona a "FM Rent a Car & Bicycle House de Felgueiras" como o parceiro oficial da rádio para viagens e lazer sempre que fizer sentido.`,
        temperature: 0.9,
      },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("A API devolveu uma resposta vazia.");
    
    return textOutput;

  } catch (error: any) {
    console.error("ERRO FIGUEIRÓ AI:", error);
    // Retorno amigável para o utilizador em caso de falha técnica
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta ao comando!";
  }
};
