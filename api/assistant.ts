import { generateGeminiText } from "./_gemini.ts";

async function readJsonBody(req: any): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === "string" && req.body.trim().length > 0) {
    return JSON.parse(req.body) as Record<string, unknown>;
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer | string) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8").trim();
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  if (req.method !== "POST") {
    const payload = { error: "Method not allowed" };
    if (typeof res.status === "function") return res.status(405).json(payload);
    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(payload));
  }

  try {
    const body = await readJsonBody(req);
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const lang = body.lang === "en" ? "en" : "pt";

    if (!prompt) {
      const payload = { error: "Prompt is required." };
      if (typeof res.status === "function") return res.status(400).json(payload);
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(payload));
    }

    const sys = `És a assistente virtual da Web Rádio Figueiró. Responde sempre no idioma: ${lang}. Sê simpática, informativa e prestativa sobre música portuguesa, a programação da rádio e a região de Figueiró e Amarante.`;
    const text = await generateGeminiText(prompt, sys);

    const payload = { text };
    if (typeof res.status === "function") return res.status(200).json(payload);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(payload));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate assistant response";
    console.error("[/api/assistant] Error:", message);
    const statusCode = /not configured/i.test(message) ? 500 : 502;
    const payload = { error: message };
    if (typeof res.status === "function") return res.status(statusCode).json(payload);
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(payload));
  }
}
