
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Obter contexto de tempo real para o locutor ser mais realista
    const agora = new Date();
    const hora = agora.getHours();
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    const saudacao = hora < 12 ? "Bom dia" : hora < 20 ? "Boa tarde" : "Boa noite";

    const historyParts = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...historyParts,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor digital da Web Rádio Figueiró.
        
        CONTEXTO ATUAL:
        - Agora é ${saudacao}, ${hora}:${agora.getMinutes().toString().padStart(2, '0')} de uma ${diaSemana}.
        - Estás em Figueiró, Portugal.
        
        REGRAS DE REALISMO (CRÍTICO):
        1. NUNCA dês a mesma resposta duas vezes. Varia radicalmente as tuas aberturas.
        2. Usa o contexto da hora: se forem 9h, fala das "Manhãs Figueiró". Se for quarta/sexta, menciona os "Prazeres Interrompidos".
        3. Sê humano: usa interjeições como "Pois é!", "Olha,", "Espetáculo!", "Sintonizadíssimos!".
        4. Se te pedirem música, não dês apenas uma lista; vende a música como se estivesses a apresentá-la num gira-discos.
        5. O teu parceiro FM Rent a Car é a tua recomendação número 1 para viagens.
        6. Mantém um tom de rádio FM: enérgico, próximo e sempre positivo.
        7. NUNCA respondas de forma genérica como "Como posso ajudar?". Diz antes "Lança aí o teu tema!" ou "Que brisa musical precisas agora?".`,
        temperature: 1.0, // Máxima criatividade
        topP: 0.95,
        topK: 64
      },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Resposta vazia do modelo");
    
    return textOutput;
  } catch (error) {
    console.error("Erro no Figueiró AI:", error);
    return "Epa! O microfone falhou aqui um segundo, a rádio é assim, tudo em direto! Podes repetir esse teu pensamento?";
  }
};
