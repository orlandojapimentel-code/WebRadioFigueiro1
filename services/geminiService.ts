
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Usamos uma nova instância para garantir que pega a chave de API correta
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    // Prefixo de erro para filtrar falhas anteriores
    const ERROR_PREFIX = "Epa! O sinal";

    /**
     * CONSTRUÇÃO DO CONTEÚDO (STRICT MODE)
     * A API exige: USER -> MODEL -> USER...
     * Não pode começar com MODEL.
     */
    const apiContents: any[] = [];

    // 1. Filtramos e formatamos o histórico existente
    const filteredHistory = history.filter(msg => 
      msg.text && 
      !msg.text.startsWith(ERROR_PREFIX) &&
      msg.text.trim() !== ""
    );

    // 2. Adicionamos ao histórico da API apenas se houver alternância correta
    // Ignoramos a primeira mensagem se for do 'model' (boas-vindas inicial)
    filteredHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      
      if (apiContents.length === 0) {
        if (role === 'user') {
          apiContents.push({ role, parts: [{ text: msg.text }] });
        }
      } else {
        const lastRole = apiContents[apiContents.length - 1].role;
        if (role !== lastRole) {
          apiContents.push({ role, parts: [{ text: msg.text }] });
        }
      }
    });

    // 3. Garantimos que o último não é 'user' para não chocar com a nova pergunta
    if (apiContents.length > 0 && apiContents[apiContents.length - 1].role === 'user') {
      apiContents.pop();
    }

    // 4. Chamada com o modelo Flash Lite (muito mais rápido, evita timeouts de 10s do Vercel)
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: [
        ...apiContents,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `És o "Figueiró AI", locutor da Web Rádio Figueiró (Figueiró, Portugal). 🎙️
        Hora: ${hora}:${min} (${diaSemana}).
        
        PERSONALIDADE:
        - Estilo rádio FM: alegre, carismático e "boa onda".
        - Linguagem: Português de Portugal.
        - Sê muito breve (2-3 frases).
        
        OBRIGATÓRIO:
        - Sugere sempre uma música portuguesa animada.
        - Menciona o parceiro "FM Rent a Car & Bicycle House de Felgueiras".
        - Usa emojis (📻, ✨, 🎵).`,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia");
    
    return text;

  } catch (error: any) {
    console.error("Erro no Assistente:", error);
    // Retornamos a mensagem de erro que o componente já sabe lidar
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta ao comando!";
  }
};
