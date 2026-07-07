
import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

// Simple in-memory cache to avoid redundant API calls and respect rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getAIInstance = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'undefined' || key === 'null' || key === '') {
    console.warn("Gemini API Key is not configured correctly.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

const FALLBACK_NEWS_PT_DATA = [
  "Web Rádio Figueiró Lança Aplicação Oficial com Emissão HD e Assistente Inteligente",
  "Feira das Cebolas de Amarante Promete Atrair Milhares de Visitantes em Julho",
  "Inaugurada a Grande Rota Pedestre de Figueiró ao Centro de Amarante",
  "Caminhada Noturna de Figueiró Reúne Dezenas de Participantes em Convívio Saudável",
  "Concertos de Verão à Beira do Rio Tâmega Animam Noites de Julho e Agosto"
].join('\n');

const FALLBACK_NEWS_EN_DATA = [
  "Web Rádio Figueiró Launches Official App with HD Broadcasting & AI Assistant",
  "Onion Fair of Amarante Promises to Attract Thousands of Visitors in July",
  "Great Pedestrian Trail from Figueiró to Amarante Center Officially Inaugurated",
  "Figueiró Night Walk Gathers Dozens of Participants in Great Community Gathering",
  "Summer Concerts by the Tâmega River Animate July and August Nights"
].join('\n');

export const fetchLatestNews = async (lang: Language = 'pt') => {
  const cacheKey = `news_${lang}`;
  const now = Date.now();

  const fallbackData = lang === 'pt' ? FALLBACK_NEWS_PT_DATA : FALLBACK_NEWS_EN_DATA;

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  if (!ai) return { text: fallbackData, source: 'LOCAL' as const };

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Lista 5 notícias ou curiosidades curtas sobre Amarante, Portugal. Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}. Apenas os títulos, um por linha.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o serviço de notícias da Web Rádio Figueiró. Sê curto, direto e profissional."
      },
    });

    const result = { text: response.text || fallbackData, source: 'LIVE' as const };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: any) {
    console.error("fetchLatestNews client error:", error);
    return { text: fallbackData, source: 'LOCAL' as const };
  }
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
TITULO: Feira das Cebolas de Amarante
DATA: 10 a 12 de Julho
LOCAL: Largo de São Gonçalo, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Caminhada Noturna de Figueiró
DATA: 25 de Julho
LOCAL: Figueiró, Amarante
TIPO: GERAL
IMAGEM: https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800
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
`;

export const fetchCulturalEvents = async () => {
  const cacheKey = 'cultural_events';
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  if (!ai) return { text: FALLBACK_CULTURAL_DATA };

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Procura eventos culturais reais, concertos, exposições, teatro ou festas populares em Amarante, Portugal para as próximas semanas e meses. 
    Retorna uma lista de eventos formatada rigorosamente usando os blocos abaixo para cada evento:

    EVENTO_START
    TITULO: [Nome do Evento]
    DATA: [Dia e Mês, ex: 15 de Julho]
    LOCAL: [Local exato em Amarante]
    TIPO: [Escolhe uma categoria: CONCERTO, EXPOSIÇÃO, TEATRO, FESTA ou GERAL]
    IMAGEM: [URL de uma imagem do cartaz ou local se encontrada]
    LINK: [URL para mais informações]
    EVENTO_END

    Inclui pelo menos 4 eventos se possível.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o curador da agenda cultural da Web Rádio Figueiró. A tua missão é encontrar eventos reais e atuais em Amarante, Portugal."
      },
    });

    const result = { text: response.text || FALLBACK_CULTURAL_DATA };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("Error fetching cultural events client:", error);
    return { text: FALLBACK_CULTURAL_DATA };
  }
};

const FALLBACK_DETAILED_NEWS_PT_STR = `
NOTICIA_START
TITULO: Web Rádio Figueiró Lança Aplicação Oficial com Emissão HD
DATA: 06 Julho, 2026
RESUMO: A Web Rádio Figueiró acaba de lançar a sua nova plataforma digital, aproximando ainda mais a comunidade local e a diáspora a Amarante.
CONTEUDO: A Web Rádio Figueiró, uma das principais vozes da freguesia de Figueiró e do concelho de Amarante, deu um passo histórico em direção ao futuro digital com a apresentação da sua nova aplicação oficial. A nova plataforma permite aos ouvintes desfrutar de uma emissão contínua em Alta Definição (HD), oferecendo uma experiência de som cristalino em qualquer parte do mundo.\\n\\nCom funções inteligentes como um assistente de inteligência artificial dedicado para pedidos de músicas, notícias regionais atualizadas e a integração direta de uma agenda cultural local, a Web Rádio Figueiró consolida o seu compromisso de liderança na divulgação cultural.\\n\\nEsta inovação tecnológica visa aproximar não só as populações que residem no concelho, mas também as vastas comunidades de emigrantes de Figueiró espalhadas pela Europa e pelo mundo, que agora têm um portal de excelência para se manterem ligadas às suas raízes e à música que mais gostam.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Feira das Cebolas de Amarante Regressa com Grande Animação
DATA: 04 Julho, 2026
RESUMO: O tradicional evento secular de Amarante está de volta, prometendo atrair milhares de visitantes com gastronomia e espetáculos populares.
CONTEUDO: A icónica Feira das Cebolas, um dos eventos mais tradicionais e queridos do concelho de Amarante, regressa ao Largo de São Gonçalo e às margens do rio Tâmega. A edição deste ano promete ser uma das mais dinâmicas de sempre, reunindo produtores agrícolas locais e de toda a região norte.\\n\\nAlém da tradicional venda de cebolas e outros produtos agrícolas, a feira contará com uma rica oferta gastronómica, com destaque para a doçaria conventual amarantina e o afamado vinho verde. A música popular terá também um papel central, com atuações de ranchos folclóricos locais e grupos de bombos.\\n\\nA Web Rádio Figueiró estará presente no certame com emissão em direto e entrevistas exclusivas com os produtores e visitantes, trazendo a atmosfera desta festa tradicional a todos os seus ouvintes espalhados pelo mundo.
IMAGEM: https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Inaugurada a Grande Rota Pedestre de Figueiró a Amarante
DATA: 02 Julho, 2026
RESUMO: O novo percurso pedestre e cultural que liga a nossa freguesia de Figueiró ao centro da cidade de Amarante já está totalmente operacional.
CONTEUDO: O património natural de Amarante conta a partir de agora com uma nova atração de excelência para os amantes de caminhadas e turismo de natureza. Foi formalmente inaugurada a Grande Rota Pedestre de Figueiró, um percurso sinalizado que guia os caminhantes por trilhos rurais verdejantes e florestas preservadas.\\n\\nO trajeto está totalmente equipado com sinalética direcional de padrão europeu e painéis interpretativos sobre a biodiversidade, a geologia e a história das lendas locais de São Gonçalo, oferecendo uma experiência imersiva e educativa.\\n\\nEste projeto, apoiado pelo município, visa revitalizar a economia das freguesias rurais como Figueiró, canalizando fluxos turísticos do centro histórico de Amarante para o interior do concelho e valorizando o comércio de proximidade.
IMAGEM: https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Caminhada Noturna de Figueiró Atrai Dezenas de Entusiastas
DATA: 29 Junho, 2026
RESUMO: O evento desportivo e comunitário reuniu famílias e atletas num percurso sob o luar que celebrou a natureza local.
CONTEUDO: A freguesia de Figueiró acolheu com enorme entusiasmo a primeira edição da sua Caminhada Noturna Sob o Luar. Organizada pela associação desportiva local com o apoio da junta de freguesia, a iniciativa reuniu dezenas de participantes de todas as idades num convívio saudável que aliou o desporto ao ar livre à contemplação do céu estrelado.\\n\\nO percurso de aproximadamente 8 quilómetros, de dificuldade baixa, levou os caminhantes por caminhos florestais e passadiços ribeirinhos iluminados apenas por lanternas e pela lua cheia, proporcionando momentos de grande beleza e tranquilidade.\\n\\nNo final do percurso, todos os participantes foram recebidos com um tradicional lanche comunitário com caldo verde e broa regional, num ambiente de grande confraternização que reforça a união e a dinâmica social de Figueiró.
IMAGEM: https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: Web Rádio Figueiró Launches Official App with HD Broadcasting
DATA: July 06, 2026
RESUMO: Web Rádio Figueiró has launched its new digital platform, bringing the local community and the diaspora closer to Amarante.
CONTEUDO: Web Rádio Figueiró, one of the leading voices of the parish of Figueiró and the municipality of Amarante, has taken a historic step toward the digital future with the presentation of its official application. The new platform allows listeners to enjoy continuous high-definition (HD) broadcasting, offering a crystal-clear sound experience anywhere in the world.\\n\\nWith smart features such as a dedicated AI assistant for music requests, updated regional news, and direct integration with a local cultural agenda, Web Rádio Figueiró consolidates its leadership in cultural communication.\\n\\nThis technological innovation aims to connect not only local residents but also the vast communities of emigrants from Figueiró scattered across Europe and the globe, who now have an excellent portal to stay connected to their origins and the music they love.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Onion Fair of Amarante Returns with Great Excitement
DATA: July 04, 2026
RESUMO: This secular traditional event is back, promising to attract thousands of visitors with gastronomy and folk entertainment.
CONTEUDO: The iconic Onion Fair, one of the most traditional and cherished events in the municipality of Amarante, returns to Largo de São Gonçalo and the banks of the Tâmega River. This year's edition promises to be one of the most dynamic ever, gathering local farmers and producers from across the northern region.\\n\\nIn addition to the traditional sale of onions and other agricultural products, the fair will feature a rich gastronomic selection, highlighting Amarante's famous conventual sweets and its exquisite Vinho Verde. Folk music will also play a central role, with performances from local folklore groups.\\n\\nWeb Rádio Figueiró will cover the event live, featuring exclusive interviews with producers and visitors to bring the warm atmosphere of this traditional feast to its listeners worldwide.
IMAGEM: https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Great Pedestrian Trail from Figueiró to Amarante Opened
DATA: July 02, 2026
RESUMO: The new scenic and cultural trail connecting the parish of Figueiró to the center of Amarante is now fully open.
CONTEUDO: Amarante's natural heritage now boasts a new attraction for hiking and nature tourism lovers. The Great Pedestrian Trail of Figueiró has been officially inaugurated, guiding hikers through beautiful green countryside paths and protected forests.\\n\\nThe path is fully equipped with European-standard direction signs and informative panels about biodiversity, geology, and local São Gonçalo legends, offering an immersive and educational experience.\\n\\nSupported by the city hall, this project aims to revitalize the economy of rural parishes like Figueiró, channeling tourist crowds from the historic center of Amarante to the inland, boosting local commerce.
IMAGEM: https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Figueiró Night Walk Gathers Dozens of Enthusiasts
DATA: June 29, 2026
RESUMO: The community sports event brought together families and athletes on a moonlit trail celebrating local nature.
CONTEUDO: The parish of Figueiró welcomed with great enthusiasm the first edition of its Moonlit Night Walk. Organized by the local sports association with the support of the parish council, the initiative brought together dozens of participants of all ages in a healthy gathering that combined outdoor sports with stargazing.\\n\\nThe approximately 8-kilometer low-difficulty trail guided hikers through forest paths and river boardwalks illuminated only by flashlights and the full moon, offering moments of sheer beauty and peace.\\n\\nAt the end of the walk, all participants were treated to a traditional community snack featuring local cabbage soup (caldo verde) and regional corn bread (broa), reinforcing the social spirit and cohesion of Figueiró.
IMAGEM: https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800
NOTICIA_END
`;

export const fetchDetailedNews = async (lang: Language = 'pt') => {
  const cacheKey = `detailed_news_${lang}`;
  const now = Date.now();

  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  const ai = getAIInstance();
  const fallbackStr = lang === 'pt' ? FALLBACK_DETAILED_NEWS_PT_STR : FALLBACK_DETAILED_NEWS_EN_STR;
  if (!ai) return { text: fallbackStr, source: 'LOCAL' as const };

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Procura as 4 notícias mais recentes e relevantes de Amarante, Portugal. 
    Para cada notícia, gera um bloco estruturado como o seguinte:

    NOTICIA_START
    TITULO: [Título Curto e Impactante]
    DATA: [Dia e Mês atualizado, ex: 15 de Maio, 2026]
    RESUMO: [Um parágrafo curto de introdução]
    CONTEUDO: [Texto detalhado da notícia com pelo menos 3 parágrafos]
    IMAGEM: [URL do Unsplash que corresponda exatamente ao assunto (deve começar por https://images.unsplash.com/photo-), OU deixa este campo vazio se não tiveres certeza, para que a rádio atribua uma imagem selecionada à mão automaticamente]
    NOTICIA_END

    AVISO IMPORTANTE: Nunca uses caminhos ou domínios de jornais locais ou nacionais (como jn.pt, sapo.pt, publico.pt) pois são bloqueados no navegador do utilizador por motivos de segurança e deixam de carregar. Usa apenas o Unsplash ou deixa vazio.

    Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "És o jornalista principal da Web Rádio Figueiró. A tua missão é trazer as novidades mais frescas de Amarante com rigor e profissionalismo."
      },
    });

    const result = { text: response.text || "", source: 'LIVE' };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("fetchDetailedNews client error:", error);
    return { text: "", source: 'LOCAL' };
  }
};

export const getRadioAssistantResponse = async (userPrompt: string, lang: Language = 'pt'): Promise<string> => {
  const ai = getAIInstance();
  if (!ai) return "Offline.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `És a assistente virtual da Web Rádio Figueiró. Responde sempre no idioma: ${lang}. Sê simpática e prestativa.`,
        tools: [{ googleSearch: {} }]
      },
    });
    return response.text || "Error.";
  } catch (error) {
    console.error("getRadioAssistantResponse error:", error);
    return "Error.";
  }
};
