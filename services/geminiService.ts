
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Serviço de IA Ultra-Rápido para Web Rádio Figueiró.
 * Corrigido para a sintaxe exata da SDK @google/genai.
 */
export const getRadioAssistantStream = async (
  history: ChatMessage[], 
  message: string, 
  onChunk: (text: string) => void
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Simplificamos ao máximo para evitar erros de contexto da API
    // Enviamos apenas a última mensagem para garantir que a resposta é rápida e sem erros
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `És o locutor "Figueiró AI" da Web Rádio Figueiró. 🎙️
        Personalidade: Alegre, direto, frases curtas de rádio.
        Regra: Máximo 12 palavras. 
        Exemplo: "Na melhor companhia! Que música queres ouvir agora?"`,
        temperature: 0.9,
      },
    });

    let fullText = "";
    // CORREÇÃO: A iteração deve ser feita diretamente no objeto de resposta
    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Erro na comunicação com o estúdio digital:", error);
    throw error;
  }
};
