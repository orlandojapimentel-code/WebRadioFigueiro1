
import { GoogleGenAI } from "@google/genai";

export const generateDedication = async (request: string) => {
  try {
    // Instanciar logo antes de usar para garantir a chave mais recente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Transforma este pedido numa dedicatória profissional de locutor de rádio (Web Rádio Figueiró). Sê caloroso e entusiasta: "${request}"` }] }],
      config: {
        systemInstruction: "És um locutor profissional da Web Rádio Figueiró. Criarás mensagens curtas, emocionantes e prontas para ler no ar. Usa termos como 'Sintonizados', 'Em direto', 'Figueiró'.",
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "Dedicatória gerada com sucesso! Continue sintonizado.";
  } catch (error) {
    console.error("Erro na dedicatória Gemini:", error);
    return "Desculpe, tive um problema técnico ao criar a sua dedicatória. Por favor, tente descrever o pedido de outra forma.";
  }
};

export const suggestPlaylistByMood = async (mood: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `O ouvinte sente-se "${mood}". Sugere 3 temas ou estilos musicais para ouvir na Web Rádio Figueiró para acompanhar este estado de espírito. Explica porquê de forma breve.` }] }],
      config: {
        systemInstruction: "És o consultor musical da Web Rádio Figueiró. O teu objetivo é elevar o humor dos ouvintes e recomendar música que combine com o que sentem.",
        temperature: 0.7,
      },
    });

    return response.text || "Temos sempre a música ideal para o seu momento!";
  } catch (error) {
    console.error("Erro na sugestão musical Gemini:", error);
    return "A música certa está a chegar. Continue a ouvir a Web Rádio Figueiró!";
  }
};
