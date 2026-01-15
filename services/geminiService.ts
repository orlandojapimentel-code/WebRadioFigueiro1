
import { GoogleGenAI } from "@google/genai";

export const getRadioAssistantStream = async (
  message: string, 
  onChunk: (text: string) => void
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_KEY");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `
      IDENTIDADE: És a "Figueiró AI", a assistente oficial da Web Rádio Figueiró.
      LOCAL: Figueiró, Portugal.
      PERSONALIDADE: Alegre, entusiasta, usa termos de rádio.
      MISSÃO: Receber pedidos de música e dedicatórias.
      REGRAS: Português de Portugal, respostas curtas (máx 2 frases). Usa emojis 🎙️📻.
    `;

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Procura os eventos mais recentes em Amarante via Google Search
 * Focado em obter URLs de imagens reais e estrutura limpa.
 */
export const fetchCulturalEvents = async () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `PESQUISA OBRIGATÓRIA: Próximos eventos no site https://www.viralagenda.com/pt/p/municipiodeamarante.
    Extrai os 6 eventos mais recentes. 
    
    REGRAS DE RESPOSTA:
    1. NÃO USES código Markdown (não uses \`\`\`).
    2. Começa a resposta diretamente com EVENTO_START.
    3. Para cada evento, tenta encontrar o URL direto da imagem (.jpg/.png).

    ESTRUTURA POR EVENTO:
    EVENTO_START
    TITULO: [Nome]
    DATA: [Ex: 25 Janeiro]
    LOCAL: [Local]
    TIPO: [Concerto, Teatro, Exposição ou Festa]
    IMAGEM: [URL da imagem ou 'null']
    LINK: [URL do evento]
    EVENTO_END`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    return { text: response.text || "" };
  } catch (error) {
    console.error("Erro na busca de eventos:", error);
    return null;
  }
};
