
import { GoogleGenAI } from "@google/genai";

// Inicialização segura
const getAI = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const generateDedication = async (request: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforma este pedido numa dedicatória profissional de locutor de rádio (Web Rádio Figueiró). Sê caloroso e entusiasta: "${request}"`,
      config: {
        systemInstruction: "És um locutor profissional da Web Rádio Figueiró. Criarás mensagens curtas, emocionantes e prontas para ler no ar.",
        temperature: 0.8,
      },
    });
    return response.text || "Dedicatória gerada com sucesso!";
  } catch (error) {
    console.error("Erro na dedicatória Gemini:", error);
    return "Desculpe, não consegui criar a dedicatória agora. Tente novamente!";
  }
};

export const suggestPlaylistByMood = async (mood: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O ouvinte sente-se "${mood}". Sugere 3 temas ou estilos musicais para ouvir na Web Rádio Figueiró para acompanhar este estado de espírito. Explica porquê de forma breve.`,
      config: {
        systemInstruction: "És o consultor musical da Web Rádio Figueiró. Conheces todos os géneros e sabes como elevar o humor dos ouvintes.",
      },
    });
    return response.text || "A rádio tem sempre a música certa para si!";
  } catch (error) {
    console.error("Erro na sugestão de humor Gemini:", error);
    return "A música certa está a chegar, continue sintonizado na Figueiró!";
  }
};
