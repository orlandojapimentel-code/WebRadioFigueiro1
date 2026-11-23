import { generateGeminiText } from "./_gemini.ts";

let cachedEvents: { text: string; timestamp: number } | null = null;
const CACHE_DURATION_MS = 30 * 60 * 1000;

function getSeasonalFallbackEvents(): string {
  const now = new Date();
  const monthName = now.toLocaleDateString("pt-PT", { month: "long" });
  const capMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const year = now.getFullYear();

  return `EVENTO_START
TITULO: Programação de Outono no Cine-Teatro de Amarante
DATA: 28 de ${capMonth}
LOCAL: Cine-Teatro de Amarante
TIPO: TEATRO
IMAGEM:
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Exposição Permanente Amadeo de Souza-Cardoso
DATA: Terça a Domingo · ${capMonth} ${year}
LOCAL: Museu Municipal Amadeo de Souza-Cardoso, Amarante
TIPO: EXPOSIÇÃO
IMAGEM:
LINK: https://www.amadeosouza-cardoso.pt
EVENTO_END

EVENTO_START
TITULO: Ciclo de Música de Câmara & Sons do Tâmega
DATA: 30 de ${capMonth}
LOCAL: Claustros do Mosteiro de São Gonçalo, Amarante
TIPO: CONCERTO
IMAGEM:
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Roteiro dos Moinhos de Água e Magusto Comunitário
DATA: Fim de Semana · ${capMonth}
LOCAL: Freguesia de Figueiró (Santiago e Santa Cristina), Amarante
TIPO: FESTA
IMAGEM:
LINK: https://www.cm-amarante.pt
EVENTO_END

EVENTO_START
TITULO: Casa da Portela · Oficinas de Artes e Património Local
DATA: Sextas e Sábados · ${capMonth}
LOCAL: Casa da Portela, Amarante
TIPO: GERAL
IMAGEM:
LINK: https://www.cm-amarante.pt
EVENTO_END`;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  if (req.method && req.method !== "GET") {
    const payload = { error: "Method not allowed" };
    if (typeof res.status === "function") return res.status(405).json(payload);
    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(payload));
  }

  const now = Date.now();
  if (cachedEvents && now - cachedEvents.timestamp < CACHE_DURATION_MS) {
    const payload = { text: cachedEvents.text, source: "CACHE" };
    if (typeof res.status === "function") return res.status(200).json(payload);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(payload));
  }

  try {
    const monthYear = new Date().toLocaleDateString("pt-PT", {
      month: "long",
      year: "numeric",
    });

    const prompt = `Procura eventos culturais, concertos, exposições, teatro ou festas populares em Amarante e Figueiró, Portugal para ${monthYear} e próximas semanas.
Retorna uma lista de eventos formatada rigorosamente usando os blocos abaixo para cada evento:

EVENTO_START
TITULO: [Nome do Evento]
DATA: [Dia e Mês, ex: 26 de Outubro]
LOCAL: [Local exato em Amarante ou Figueiró]
TIPO: [Escolhe uma categoria: CONCERTO, EXPOSIÇÃO, TEATRO, FESTA ou GERAL]
IMAGEM: [deixar vazio]
LINK: [URL para mais informações, ex: https://www.cm-amarante.pt]
EVENTO_END

Inclui pelo menos 4 eventos relevantes da agenda cultural da região de Amarante e Tâmega.`;

    const sys =
      "És o curador da agenda cultural da Web Rádio Figueiró. A tua missão é apresentar eventos culturais relevantes em Amarante e Figueiró, Portugal.";

    const text = await generateGeminiText(prompt, sys);
    if (text && text.includes("EVENTO_START")) {
      cachedEvents = { text, timestamp: now };
      const payload = { text, source: "LIVE" };
      if (typeof res.status === "function") return res.status(200).json(payload);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(payload));
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load cultural events";
    console.warn("[/api/cultural-events] Falling back to curated regional agenda:", message);
  }

  const fallbackText = cachedEvents?.text || getSeasonalFallbackEvents();
  const payload = { text: fallbackText, source: "CURATED" };
  if (typeof res.status === "function") return res.status(200).json(payload);
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  return res.end(JSON.stringify(payload));
}
