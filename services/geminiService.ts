
import { Language } from "../translations";

// Simple in-memory cache to avoid redundant API calls and respect rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const FALLBACK_NEWS_DATA = [
  "Web Rádio Figueiró: Sintonize a melhor seleção musical de Amarante 24h por dia.",
  "Peça a sua música favorita através do nosso novo Centro de Pedidos digital.",
  "WRF Digital: Tecnologia de ponta e som de alta fidelidade para todos os ouvintes.",
  "Acompanhe as nossas redes sociais para ficar a par de todos os eventos da região.",
  "Web Rádio Figueiró: A elevar a voz de Amarante para o mundo inteiro."
].join('\n');

export const fetchLatestNews = async (lang: Language = 'pt') => {
  const cacheKey = `news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await fetch(`/api/news-ticker?lang=${lang}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    
    const result = { text: data.text || FALLBACK_NEWS_DATA, source: data.source || 'LOCAL', grounding: [] };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("fetchLatestNews client error:", error);
    return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const, grounding: [] };
  }
};

export const getRadioAssistantResponse = async (userPrompt: string, lang: Language = 'pt'): Promise<string> => {
  // Podes implementar esta rota no servidor se necessário, por agora mantemos fallback
  return "Assistente temporariamente offline para manutenção.";
};

const FALLBACK_CULTURAL_DATA = `
EVENTO_START
TITULO: Música no Rio
DATA: Todos os Sábados de Julho
LOCAL: Parque Ribeirinho, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Exposição Amadeo de Souza-Cardoso
DATA: Permanente
LOCAL: Museu Municipal, Amarante
TIPO: EXPOSIÇÃO
IMAGEM: https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Cinema ao Ar Livre
DATA: Sextas-feiras, 21:30
LOCAL: Claustros do Convento, Amarante
TIPO: GERAL
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Feira de Artesanato
DATA: Último Domingo do Mês
LOCAL: Largo de S. Gonçalo, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END
`;

export const fetchCulturalEvents = async () => {
  const cacheKey = 'cultural_events';
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await fetch('/api/events');
    if (!response.ok) throw new Error();
    const data = await response.json();
    
    const result = { text: data.text || FALLBACK_CULTURAL_DATA };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("Error fetching cultural events client:", error);
    return { text: FALLBACK_CULTURAL_DATA };
  }
};

export const fetchDetailedNews = async (lang: Language = 'pt') => {
  const cacheKey = `detailed_news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await fetch(`/api/news?lang=${lang}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    
    const result = { text: data.text || "", source: data.source || 'LOCAL' };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("fetchDetailedNews client error:", error);
    return { text: "", source: 'LOCAL' };
  }
};
