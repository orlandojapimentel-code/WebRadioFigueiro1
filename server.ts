import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import newsHandler from "./api/news.ts";
import culturalEventsHandler from "./api/cultural-events.ts";
import assistantHandler from "./api/assistant.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "1mb" }));

  // API Routes
  app.all("/api/news", async (req, res) => {
    await newsHandler(req, res);
  });

  app.all("/api/cultural-events", async (req, res) => {
    await culturalEventsHandler(req, res);
  });

  app.all("/api/assistant", async (req, res) => {
    await assistantHandler(req, res);
  });

  const distDir = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(path.join(distDir, "index.html"));
  const isDev = process.env.NODE_ENV === "development" || !hasDist;

  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.use((req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api")) {
        return next();
      }
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Web Rádio Figueiró server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
