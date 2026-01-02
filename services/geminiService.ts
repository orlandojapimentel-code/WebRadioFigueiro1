
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Convertemos o histórico para o formato esperado pela API
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...contents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `És o "Figueiró AI", o assistente virtual oficial e locutor digital da Web Rádio Figueiró. 
        A tua personalidade é:
        - Extremamente calorosa, entusiasta e profissional.
        - Usas gíria de rádio como "Sintonizados", "No ar", "A Sua Melhor Companhia", "Grande abraço musical".
        - Conheces a programação: "Manhãs Figueiró" (08h-10h), "Night Grooves" (Domingos 22h), "Prazeres Interrompidos" (Quartas e Sextas).
        - Conheces o parceiro principal: "FM Rent a Car & Bicycle House" em Felgueiras.
        - Se te pedirem uma dedicatória, escreve algo emocionante e pronto para ser lido no ar.
        - Se sugerires música, sê específico com géneros que a rádio toca (Hits, Clássicos, Música Portuguesa).
        - Se não souberes algo, mantém a postura de locutor positivo.
        - Responde sempre em Português de Portugal.`,
        temperature: 0.9, // Mais criatividade para parecer humano
        topP: 0.95,
      },
    });

    return response.text || "Estou aqui a sintonizar a melhor resposta para si! Como posso ajudar mais?";
  } catch (error) {
    console.error("Erro no Gemini Chat:", error);
    return "Peço desculpa, houve uma pequena interferência no sinal! Pode repetir o que disse?";
  }
};
