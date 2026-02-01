
import { GoogleGenAI } from "@google/genai";

/**
 * Inicializa o SDK de forma segura.
 */
const getAIInstance = () => {
  const key = process.env.API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Conteúdo de reserva para quando a API atinge limites ou falha.
 * Mantém a aplicação funcional e com aspeto "vivo".
 */
const FALLBACK_NEWS_DATA = [
  "Web Rádio Figueiró: Sintonize a melhor seleção musical de Amarante 24h por dia.",
  "Peça a sua música favorita através do nosso novo Centro de Pedidos digital.",
  "WRF Digital: Tecnologia de ponta e som de alta fidelidade para todos os ouvintes.",
  "Acompanhe as nossas redes sociais para ficar a par de todos os eventos da região.",
  "Web Rádio Figueiró: A elevar a voz de Amarante para o mundo inteiro."
].join('\n');

/**
 * Busca notícias ou curiosidades sobre Amarante.
 * Implementação resiliente que evita logs de erro "scary" no console.
 */
export const fetchLatestNews = async () => {
  const ai = getAIInstance();
  
  // Se não houver IA disponível, retorna o conteúdo de backup imediatamente
  if (!ai) {
    return { 
      text: FALLBACK_NEWS_DATA, 
      source: 'LOCAL' as const, 
      grounding: [] 
    };
  }

  const model = 'gemini-3-flash-preview';
  const prompt = "Lista 5 notícias ou curiosidades curtas sobre Amarante, Portugal. Apenas os títulos, um por linha.";

  try {
    // Tentativa 1: Pesquisa em tempo real (Google Search Grounding)
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional."
        },
      });

      if (response && response.text && response.text.length > 10) {
        return { 
          text: response.text, 
          source: 'LIVE' as const,
          grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
        };
      }
    } catch (innerError) {
      // Falha na pesquisa (quota ou erro de ferramenta), segue para geração normal
    }

    // Tentativa 2: Geração baseada no conhecimento interno da IA
    const fallbackResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "És o animador da Web Rádio Figueiró. Gera títulos interessantes e atuais sobre Amarante."
      }
    });

    if (fallbackResponse && fallbackResponse.text) {
      return { 
        text: fallbackResponse.text, 
        source: 'LOCAL' as const,
        grounding: [] 
      };
    }

    return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };

  } catch (error) {
    // Erro crítico (ex: Quota Exceeded). Retorna backup silenciosamente.
    return { 
      text: FALLBACK_NEWS_DATA, 
      source: 'LOCAL' as const, 
      grounding: [] 
    };
  }
};

/**
 * Busca eventos culturais (para uso em widgets ou agenda).
 * FIX: Atualizado para retornar o formato de blocos esperado pelo componente AgendaCultural.
 */
export const fetchCulturalEvents = async () => {
  const ai = getAIInstance();
  if (!ai) return { text: "" };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Pesquisa e lista 3 eventos culturais reais em Amarante, Portugal para os próximos meses.",
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: `Gera a resposta estritamente no seguinte formato para CADA evento:
EVENTO_START
TITULO: Nome do Evento
DATA: Data por extenso (ex: 20 de Maio)
LOCAL: Local exato em Amarante
TIPO: Categoria (CONCERTO, EXPOSIÇÃO, TEATRO, FESTA ou GERAL)
IMAGEM: URL de uma imagem real representativa do local ou evento
LINK: URL oficial para mais informações
EVENTO_END`
      },
    });
    return { text: response.text || "" };
  } catch (error) {
    return { text: "" };
  }
};

/**
 * Responde a perguntas do chat da rádio.
 * FIX: Implementação necessária para o componente GeminiAssistant.
 */
export const getRadioAssistantResponse = async (userPrompt: string): Promise<string> => {
  const ai = getAIInstance();
  if (!ai) return "Desculpa, a minha inteligência artificial está offline de momento.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "És a assistente virtual da Web Rádio Figueiró. Sê simpática, prestativa e fala sobre música ou Amarante. Mantém as respostas curtas e amigáveis. Usa o Google Search se precisares de informações atuais.",
        tools: [{ googleSearch: {} }]
      },
    });

    let resultText = response.text || "Não consegui processar o teu pedido.";
    
    // Extrai URLs de grounding para exibição, conforme as diretrizes obrigatórias da API
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      const links = groundingChunks
        .map(chunk => chunk.web?.uri)
        .filter(Boolean)
        .slice(0, 2);
      
      if (links.length > 0) {
        resultText += "\n\nSaiba mais em:\n" + links.join('\n');
      }
    }

    return resultText;
  } catch (error) {
    return "Desculpa, tive uma pequena falha na sintonização. Podes repetir a tua pergunta?";
  }
};
