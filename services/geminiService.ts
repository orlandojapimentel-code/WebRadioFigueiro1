
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  // Verifica se a API KEY existe no ambiente do Vercel
  if (!process.env.API_KEY) {
    console.error("API_KEY em falta");
    return "Sintonizado! Mas o meu sistema de voz precisa da chave de ativação. Configura a API_KEY no painel.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const timeStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    // Construção robusta do conteúdo para a API
    const contents: any[] = [];
    
    // Filtramos o histórico para garantir que as mensagens são válidas e alternadas
    const validHistory = history.filter(m => 
      m.text && 
      m.text.length > 0 && 
      !m.text.includes("estalido") && 
      !m.text.includes("estática")
    ).slice(-4); // Apenas as últimas 4 para máxima velocidade

    validHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Só adiciona se for o primeiro ou se o papel for diferente do anterior (regra da API)
      if (contents.length === 0) {
        if (role === 'user') contents.push({ role, parts: [{ text: msg.text }] });
      } else if (contents[contents.length - 1].role !== role) {
        contents.push({ role, parts: [{ text: msg.text }] });
      }
    });

    // A mensagem que vamos enviar agora é sempre 'user'. 
    // Se a última do histórico também for 'user', removemos do histórico para não falhar a alternância.
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents.pop();
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...contents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `És o "Figueiró AI", locutor da Web Rádio Figueiró. 📻
        Hora atual: ${timeStr}.
        Personalidade: Alegre, muito breve (máx 20 palavras) e entusiasta. 
        Sugere artistas portugueses e menciona a "FM Rent a Car".`,
        temperature: 0.8,
        maxOutputTokens: 100,
      },
    });

    return response.text || "Sintonizado e a postos! O que queres ouvir?";

  } catch (error) {
    console.error("Erro na resposta da IA:", error);
    // Mensagem de fallback mais amigável
    return "O sinal aqui no estúdio digital apanhou um pouco de estática! 📻 Mas a música continua. O que tens em mente?";
  }
};
