
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

  const ai = getAIInstance();
  if (!ai) return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const };

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

    const result = { text: response.text || FALLBACK_NEWS_DATA, source: 'LIVE' as const };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error: any) {
    console.error("fetchLatestNews client error:", error);
    return { text: FALLBACK_NEWS_DATA, source: 'LOCAL' as const };
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
TITULO: Exposição Amadeo de Souza-Cardoso
DATA: Permanente
LOCAL: Museu Municipal, Amarante
TIPO: EXPOSIÇÃO
IMAGEM: https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Festival Literário de Amarante
DATA: 12 de Outubro
LOCAL: Biblioteca Municipal Albano Sardoeira, Amarante
TIPO: GERAL
IMAGEM: https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Romaria de São Gonçalo de Amarante
DATA: Primeiro Fim de Semana de Junho
LOCAL: Largo de S. Gonçalo, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
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
DATA: 16 Junho, 2026
RESUMO: A Web Rádio Figueiró acaba de lançar a sua nova plataforma digital, aproximando ainda mais a comunidade local e a diáspora a Amarante.
CONTEUDO: A Web Rádio Figueiró, uma das principais vozes da freguesia de Figueiró e do concelho de Amarante, deu um passo histórico em direção ao futuro digital com a apresentação da sua nova aplicação oficial. A nova plataforma permite aos ouvintes desfrutar de uma emissão contínua em Alta Definição (HD), oferecendo uma experiência de som cristalino em qualquer parte do mundo.\\n\\nCom funções inteligentes como um assistente de inteligência artificial dedicado para pedidos de músicas, notícias regionais atualizadas e a integração direta de uma agenda cultural local, a Web Rádio Figueiró consolida o seu compromisso de liderança na divulgação cultural.\\n\\nEsta inovação tecnológica visa aproximar não só as populações que residem no concelho, mas também as vastas comunidades de emigrantes de Figueiró espalhadas pela Europa e pelo mundo, que agora têm um portal de excelência para se manterem ligadas às suas raízes e à música que mais gostam.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Feira de Artesanato e Gastronomia de Amarante Promete Recorde
DATA: 14 Junho, 2026
RESUMO: O certame deste ano reúne dezenas de artesãos locais e produtores do famoso vinho verde da região no centro histórico.
CONTEUDO: A tradicional Feira de Artesanato e Gastronomia de Amarante arranca já no próximo fim de semana com a expetativa de ser a maior edição de sempre. Organizada em parceria com as associações regionais, a feira irá transformar as margens do rio Tâmega e o Largo de São Gonçalo no epicentro da cultura tradicional portuguesa.\\n\\nPara além de trabalhos manuais únicos em madeira, barro e tecelagem, os visitantes poderão deliciar-se com os famosos doces conventuais de Amarante e provar os vinhos verdes de produtores de Figueiró e freguesias vizinhas.\\n\\nA Web Rádio Figueiró terá uma equipa no local para fazer a cobertura de rádio em direto, entrevistando artesãos e visitantes e transmitindo toda a animação musical deste evento que é um orgulho para a nossa região portuguesa.
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Roteiro dos Caminhos de São Gonçalo Revitaliza Turismo
DATA: 10 Junho, 2026
RESUMO: O novo percurso pedestre e cultural que liga Figueiró ao coração histórico de Amarante já está aberto ao público.
CONTEUDO: O turismo de Amarante conta com uma nova atração de grande valor patrimonial e ambiental. Foi inaugurado oficialmente o Roteiro Pedestre dos Caminhos de São Gonçalo, um trilho que percorre caminhos rurais históricos a partir da freguesia de Figueiró até à icónica ponte de Amarante.\\n\\nO trajeto, totalmente sinalizado e dotado de painéis informativos sobre a fauna, flora e lendas locais, promete atrair caminhantes, amantes da natureza e peregrinos.\\n\\nA iniciativa visa promover a descentralização turística na região, destacando a riqueza florestal e as belas paisagens ribeirinhas que caracterizam Figueiró e arredores, incentivando simultaneamente o comércio local.
IMAGEM: https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Encontro de Concertinas de Figueiró Junta Gerações
DATA: 08 Junho, 2026
RESUMO: As ruas de Figueiró encheram-se de ritmo e tradição musical num convívio que celebra as canções populares.
CONTEUDO: A música tradicional portuguesa esteve em destaque no Encontro Regional de Concertinas de Figueiró, Amarante. O evento, promovido pelo grupo de folclore local, reuniu mais de uma dezena de ranchos e grupos informais de tocadores vindos de vários pontos do norte do país.\\n\\nAs ruas encheram-se de sons alegres e desgarradas improvisadas, atraindo centenas de espetadores de todas as idades num ambiente de festa e partilha comunitária.\\n\\nO sucesso da iniciativa reforça a importância de preservar e transmitir as tradições musicais locais aos mais jovens, garantindo que a identidade de Figueiró continua bem viva.
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: Web Rádio Figueiró Launches Official App with HD Broadcasting
DATA: June 16, 2026
RESUMO: Web Rádio Figueiró has launched its new digital platform, bringing the local community and the diaspora closer to Amarante.
CONTEUDO: Web Rádio Figueiró, one of the leading voices of the parish of Figueiró and the municipality of Amarante, has taken a historic step toward the digital future with the presentation of its official application. The new platform allows listeners to enjoy continuous high-definition (HD) broadcasting, offering a crystal-clear sound experience anywhere in the world.\\n\\nWith smart features such as a dedicated AI assistant for music requests, updated regional news, and direct integration with a local cultural agenda, Web Rádio Figueiró consolidates its leadership in cultural communication.\\n\\nThis technological innovation aims to connect not only local residents but also the vast communities of emigrants from Figueiró scattered across Europe and the globe, who now have an excellent portal to stay connected to their origins and the music they love.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Crafts and Gastronomy Fair of Amarante Promises Record Attendance
DATA: June 14, 2026
RESUMO: This year's event gathers local artisans and producers of the region's famous Vinho Verde in the historic center.
CONTEUDO: The traditional Crafts and Gastronomy Fair of Amarante kicks off next weekend with the expectation of being the largest edition ever. Organized in partnership with regional associations, the fair will transform the banks of the Tâmega River and the São Gonçalo Square into the epicenter of traditional Portuguese culture.\\n\\nIn addition to unique wooden, clay, and weaving handicrafts, visitors will be able to enjoy Amarante's famous conventual sweets and taste Vinho Verde wines from producers in Figueiró and neighboring parishes.\\n\\nWeb Rádio Figueiró will have a live broadcasting team on site, interviewing artisans and visitors to share all the musical excitement of this prideful regional event.
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: São Gonçalo Trail Revitalizes Regional Tourism
DATA: June 10, 2026
RESUMO: The new pedestrian and cultural trail connecting Figueiró to the historic heart of Amarante is now open to the public.
CONTEUDO: Tourism in Amarante has a new attraction of great environmental and heritage value. The Pedestrian Trail of São Gonçalo was officially inaugurated, walking through historic rural paths from the parish of Figueiró to the iconic Amarante bridge.\\n\\nThe trail, fully signposted with informative panels about local fauna, flora, and legends, promises to attract hikers, nature lovers, and pilgrims.\\n\\nThis initiative aims to promote tourism decentralization in the region, highlighting the forest and river landscapes of Figueiró, while boosting the local economy.
IMAGEM: https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Concertina Meeting of Figueiró Unites Generations
DATA: June 08, 2026
RESUMO: The streets of Figueiró filled with rhythm and traditional music in a gathering that celebrates regional folk songs.
CONTEUDO: Traditional Portuguese music took center stage at the Regional Concertina Meeting in Figueiró, Amarante. The event, promoted by the local folklore group, brought together more than a dozen groups and individual players from all over northern Portugal.\\n\\nThe streets were filled with happy sounds and improvised folk songs, attracting hundreds of spectators of all ages in an atmosphere of sharing and joy.\\n\\nThe success of this initiative strengthens the preservation of local musical traditions, ensuring that the identity of Figueiró remains vibrant for future generations.
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
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
    IMAGEM: [URL de uma imagem real relacionada se encontrada, senão deixa vazio]
    NOTICIA_END

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
