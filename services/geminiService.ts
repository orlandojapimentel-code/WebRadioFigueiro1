
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
  "Festas de São Bartolomeu em Amarante Arrancam esta Semana com Grande Cartaz",
  "Figueiró Celebra com Sucesso Festa de Nossa Senhora do Moreira e Prepara Encontro Cultural",
  "Noite Branca de Amarante Marcada para 29 de Agosto Ilumina as Margens do Rio Tâmega",
  "Web Rádio Figueiró Atinge Recorde Histórico de Audiência Digital na Europa e Américas",
  "Concertos de Verão à Beira do Rio Tâmega Continuam em Destaque em Agosto"
].join('\n');

const FALLBACK_NEWS_EN_DATA = [
  "São Bartolomeu Festivities in Amarante Kick Off This Week with Stellar Line-up",
  "Figueiró Successfully Celebrates Nossa Senhora do Moreira Festivities with Community Reunion",
  "Amarante White Night Set for August 29 to Light Up the Tâmega Riverbanks",
  "Web Rádio Figueiró Hits Record Digital Audience Across Europe and the Americas",
  "Summer Concerts by the Tâmega River Continue Throughout August"
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
    const prompt = `Lista 5 notícias ou curiosidades curtas mais recentes sobre Amarante e Figueiró, Portugal (Agosto de 2026). Escreve obrigatoriamente em ${lang === 'pt' ? 'Português' : 'Inglês'}. Apenas os títulos, um por linha.`;

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
TITULO: Festas de São Bartolomeu
DATA: 20 a 24 de Agosto
LOCAL: Largo de São Gonçalo, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Festa de N. Senhora do Moreira
DATA: 14 a 16 de Agosto
LOCAL: Figueiró, Amarante
TIPO: FESTA
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Noite Branca de Amarante
DATA: 29 de Agosto
LOCAL: Centro Histórico, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Concertos de Verão no Rio Tâmega
DATA: Todos os Sábados de Agosto
LOCAL: Parque Ribeirinho, Amarante
TIPO: CONCERTO
IMAGEM: https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800
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
    const prompt = `Procura eventos culturais reais, concertos, exposições, teatro ou festas populares em Amarante e Figueiró, Portugal para este mês de Agosto e próximas semanas de 2026. 
    Retorna uma lista de eventos formatada rigorosamente usando os blocos abaixo para cada evento:

    EVENTO_START
    TITULO: [Nome do Evento]
    DATA: [Dia e Mês, ex: 20 de Agosto]
    LOCAL: [Local exato em Amarante ou Figueiró]
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
        systemInstruction: "És o curador da agenda cultural da Web Rádio Figueiró. A tua missão é encontrar eventos reais e atuais em Amarante e Figueiró, Portugal."
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
TITULO: Festas de São Bartolomeu em Amarante Arrancam esta Semana com Grande Cartaz
DATA: 18 Agosto, 2026
RESUMO: O centro histórico de Amarante recebe cinco dias de grande animação popular, concertos, folclore e fogo de artifício no Tâmega.
CONTEUDO: O concelho de Amarante prepara-se para acolher uma das suas celebrações de verão mais aguardadas: as tradicionais Festas de São Bartolomeu, que decorrem de 20 a 24 de agosto. Durante quase uma semana, as margens do rio Tâmega e o Largo de São Gonçalo transformam-se num epicentro vibrante de cultura, música popular e convívio comunitário.\\n\\nA programação inclui concertos de artistas nacionais, atuações de bandas filarmónicas, encontros de grupos de bombos e ranchos folclóricos da região — com especial destaque para os costumes e trajes de Figueiró. O momento alto das festividades será o majestoso espetáculo piromusical sobre as águas do rio Tâmega.\\n\\nA Web Rádio Figueiró estará em direto no local com estúdio móvel e reportagens exclusivas, transmitindo a emoção das festas aos ouvintes em Amarante e à comunidade emigrante na diáspora.
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Figueiró Celebra com Sucesso Festa de Nossa Senhora do Moreira e Prepara Encontro Cultural
DATA: 16 Agosto, 2026
RESUMO: A comunidade de Figueiró acolheu centenas de fiéis e emigrantes nas suas celebrações anuais, reforçando a união e tradição paroquial.
CONTEUDO: A freguesia de Figueiró viveu dias de profunda alegria e comunhão com a celebração da tradicional Festa em Honra de Nossa Senhora do Moreira. As cerimónias religiosas, marcadas pela solene procissão com andores ricamente ornamentados por flores naturais, atraíram centenas de residentes e emigrantes em férias na terra natal.\\n\\nPara além da componente religiosa, as noites foram animadas por espetáculos de variedades, desgarradas e cantares ao desafio, demonstrando a vitalidade do património etnográfico local.\\n\\nA comissão de festas expressou um agradecimento caloroso a todos os que contribuíram para o sucesso deste reencontro comunitário e anunciou já um próximo convívio de outono.
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Noite Branca de Amarante Marcada para 29 de Agosto Ilumina as Margens do Rio Tâmega
DATA: 14 Agosto, 2026
RESUMO: Múltiplos palcos, performances de artes de rua, DJs e gastronomia regional vestem o centro histórico de branco até de madrugada.
CONTEUDO: A magia da Noite Branca está de regresso a Amarante no próximo dia 29 de agosto, prometendo reunir milhares de visitantes vestidos a rigor. As ruas e praças do centro histórico acolherão múltiplos palcos musicais com géneros que vão do pop/rock à música eletrónica, além de estátuas vivas, artes circenses e espetáculos visuais de luz.\\n\\nOs restaurantes, esplanadas e comércio tradicional permanecerão abertos com ementas especiais destacando os vinhos verdes da sub-região de Amarante e a tradicional doçaria conventual.\\n\\nA equipa da Web Rádio Figueiró acompanhará toda a emissão em tempo real com entrevistas a artistas, comerciantes e visitantes.
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Atinge Recorde Histórico de Audiência Digital na Europa e Américas
DATA: 11 Agosto, 2026
RESUMO: A nova plataforma digital com transmissão em Alta Definição (HD) e assistente inteligente conecta mais de 50 mil ouvintes.
CONTEUDO: A Web Rádio Figueiró consolidou este mês a sua posição de liderança como o maior veículo de ligação entre o concelho de Amarante e as comunidades de emigrantes portugueses espalhadas pelo mundo. Dados recentes de audiência digital registam um crescimento recorde após o lançamento da nova aplicação móvel com som HD e assistente musical inteligente.\\n\\nOuvintes em países como França, Suíça, Alemanha, Luxemburgo, Estados Unidos e Brasil destacam a facilidade de pedir músicas, ouvir notícias locais em tempo real e acompanhar os eventos culturais de Figueiró.\\n\\nA direção da rádio agradece a fidelidade de todos e reafirma a sua dedicação incondicional à promoção da cultura, da música portuguesa e das gentes de Figueiró.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
NOTICIA_END
`;

const FALLBACK_DETAILED_NEWS_EN_STR = `
NOTICIA_START
TITULO: São Bartolomeu Festivities in Amarante Kick Off This Week with Stellar Line-up
DATA: August 18, 2026
RESUMO: The historic center of Amarante hosts five days of live concerts, folklore, street entertainment, and fireworks over the Tâmega River.
CONTEUDO: The municipality of Amarante is ready to host one of its most celebrated summer traditions: the São Bartolomeu Festivities, running from August 20 to 24. For nearly a week, the riverbanks of the Tâmega and São Gonçalo Square become the vibrant epicenter of Portuguese culture, traditional music, and joyful community life.\\n\\nThe official schedule includes performances by renowned national artists, philharmonic bands, drumming groups, and local folk dance troupes — highlighting the rich heritage and traditional costumes of Figueiró. The grand finale will feature a stunning pyromusical fireworks show over the Tâmega River.\\n\\nWeb Rádio Figueiró will broadcast live from the venue, connecting local listeners and diaspora families worldwide.
IMAGEM: https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Figueiró Successfully Celebrates Nossa Senhora do Moreira Festivities with Community Reunion
DATA: August 16, 2026
RESUMO: The parish of Figueiró welcomed hundreds of devotees and returning emigrants for annual religious and folk celebrations.
CONTEUDO: The parish of Figueiró experienced days of profound warmth and unity during the traditional festivities in honor of Nossa Senhora do Moreira. The solemn religious procession, adorned with handmade natural flower arrangements, drew hundreds of local residents and overseas families visiting their hometown for summer vacation.\\n\\nEvenings featured lively folk concerts, accordion challenges, and traditional games, highlighting the strength of regional heritage.\\n\\nThe organizing committee thanked all volunteers and attendees for making this reunion unforgettable and announced upcoming autumn gatherings.
IMAGEM: https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Amarante White Night Set for August 29 to Light Up the Tâmega Riverbanks
DATA: August 14, 2026
RESUMO: Multiple concert stages, street art performances, DJs, and regional gastronomy will turn the historic center white until dawn.
CONTEUDO: The magic of the Amarante White Night returns on August 29, promising to attract thousands of visitors dressed in all-white attire. The streets and scenic squares will host multiple music stages spanning pop/rock and electronic beats, alongside living statues, circus arts, and light installations.\\n\\nLocal restaurants, terraces, and shops will remain open late, serving regional Vinho Verde and traditional conventual sweets.\\n\\nWeb Rádio Figueiró will provide live on-air reporting with exclusive artist interviews and audience reactions throughout the evening.
IMAGEM: https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800
NOTICIA_END

NOTICIA_START
TITULO: Web Rádio Figueiró Hits Record Digital Audience Across Europe and the Americas
DATA: August 11, 2026
RESUMO: The new digital broadcasting platform with HD audio and AI music requests connects more than 50,000 active listeners.
CONTEUDO: Web Rádio Figueiró has solidified its standing as the primary cultural bridge connecting Amarante and Figueiró to Portuguese diaspora communities worldwide. Recent metrics show unprecedented digital growth following the release of the updated mobile application featuring crystal-clear HD streaming and an intelligent music assistant.\\n\\nListeners in France, Switzerland, Germany, Luxembourg, the United States, and Brazil praised the platform for seamless music requests and live regional news.\\n\\nStation management expressed heartfelt gratitude to all listeners and pledged continued commitment to promoting Portuguese culture and community ties.
IMAGEM: https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800
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
    const prompt = `Procura as 4 notícias mais recentes e relevantes de Amarante e Figueiró, Portugal para este mês de Agosto de 2026. 
    Para cada notícia, gera um bloco estruturado como o seguinte:

    NOTICIA_START
    TITULO: [Título Curto e Impactante]
    DATA: [Dia e Mês atualizado, ex: 05 de Agosto, 2026]
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
        systemInstruction: "És o jornalista principal da Web Rádio Figueiró. A tua missão é trazer as novidades mais frescas de Amarante e Figueiró com rigor e profissionalismo."
      },
    });

    const result = { text: response.text || fallbackStr, source: 'LIVE' as const };
    cache[cacheKey] = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("fetchDetailedNews client error:", error);
    return { text: fallbackStr, source: 'LOCAL' as const };
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
