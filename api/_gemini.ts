import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-4-hydrogen";

export function getServerAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.");
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function generateGeminiText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const ai = getServerAI();
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      const text = response.text?.trim();
      if (text && text.length > 0) {
        return text;
      }
      throw new Error("Empty response received from Gemini API.");
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      // Do not retry on auth/invalid/not-found errors
      if (/400|401|403|404|PERMISSION_DENIED|API_KEY_INVALID|NOT_FOUND/i.test(msg)) {
        break;
      }
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
