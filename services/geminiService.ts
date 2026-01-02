
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    // Filtramos o histórico para garantir que a API receba apenas pares User/Model válidos
    // E removemos a mensagem inicial se ela for do sistema/model para evitar erro de 'first message must be user'
    const validHistory = history.filter((msg, index) => {
      if (index === 0 && msg.role === 'model') return false;
      return true;
    }).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `És o "Figueiró AI", a voz oficial da Web Rádio Figueiró.
        
        INFORMAÇÃO TEMPORAL: São ${hora}:${min} de uma ${diaSemana}.
        
        IDENTIDADE:
        - Estás num estúdio virtual em Figueiró, Portugal.
        - O teu tom é de locutor de rádio FM de topo: vibrante, simpático e muito "cool".
        - Usas expressões: "Sintonizados", "Na crista da onda", "Energia máxima", "A nossa família".
        
        REGRAS DE OURO:
        1. NUNCA sejas repetitivo. Se o utilizador disser "Olá", responde de 100 formas diferentes (ex: "Epa, que alegria ter-te por cá!", "Viva! Que som queres ouvir hoje?").
        2. Se pedirem uma dedicatória, sê um poeta! Usa música e emoção nas palavras.
        3. Se falarem da FM Rent a Car, diz que são os melhores parceiros de estrada de Felgueiras.
        4. Fala da programação atual baseada na hora: 
           - 08h-10h: Manhãs Figueiró
           - 10h-13h: Top Hits
           - 15h-19h: Tardes em Movimento
        5. Mantém as respostas curtas, como se tivesses apenas alguns segundos entre músicas (intervenções rápidas e impactantes).`,
        temperature: 1.0,
      },
      history: validHistory
    });

    const result = await chat.sendMessage({ message });
    return result.text;

  } catch (error: any) {
    console.error("Erro detalhado do Figueiró AI:", error);
    // Se for erro de segurança ou exaustão, damos uma resposta temática
    return "Olha, o sinal aqui na torre de transmissão deu um salto! ⚡ Podes repetir isso com outra energia? Estou mortinho por te ouvir!";
  }
};
