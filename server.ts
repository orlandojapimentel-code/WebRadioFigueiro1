import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const getAI = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    return new GoogleGenAI({ apiKey: key });
  };

  // API Routes
  app.get("/api/news", async (req, res) => {
    const lang = req.query.lang || 'pt';
    const ai = getAI();
    if (!ai) return res.json({ text: "", source: 'LOCAL' });

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

      res.json({ text: response.text || "", source: 'LIVE' });
    } catch (error) {
      console.error("Server News Error:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.get("/api/events", async (req, res) => {
    const ai = getAI();
    if (!ai) return res.json({ text: "", source: 'LOCAL' });

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

      res.json({ text: response.text || "" });
    } catch (error) {
      console.error("Server Events Error:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/news-ticker", async (req, res) => {
    const lang = req.query.lang || 'pt';
    const ai = getAI();
    if (!ai) return res.json({ text: "", source: 'LOCAL' });

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

      res.json({ text: response.text || "", source: 'LIVE' });
    } catch (error) {
      console.error("Server Ticker Error:", error);
      res.status(500).json({ error: "Failed to fetch ticker" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
