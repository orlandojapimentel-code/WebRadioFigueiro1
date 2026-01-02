
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getRadioAssistantResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Inicialização do cliente. O process.env.API_KEY é injetado automaticamente.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes().toString().padStart(2, '0');
    const diaSemana = agora.toLocaleDateString('pt-PT', { weekday: 'long' });
    
    /**
     * SANITIZAÇÃO RIGOROSA DO HISTÓRICO
     * Para evitar erros 400 no Vercel, o histórico enviado deve:
     * 1. Começar obrigatoriamente por 'user'.
     * 2. Alternar estritamente entre 'user' e 'model'.
     * 3. Não conter mensagens de erro técnico anteriores.
     */
    const ERROR_PREFIX = "Epa! O sinal aqui no estúdio digital";
    
    // 1. Filtrar ruído e mensagens de erro
    const filteredHistory = history.filter(msg => 
      msg.text && 
      msg.text.trim() !== "" && 
      !msg.text.startsWith(ERROR_PREFIX)
    );

    const apiHistory: any[] = [];
    
    // 2. Construir histórico com alternância garantida
    for (const msg of filteredHistory) {
      const role = msg.role === 'user' ? 'user' : 'model';
      
      if (apiHistory.length === 0) {
        // A primeira mensagem da API tem de ser 'user'
        if (role === 'user') {
          apiHistory.push({ role, parts: [{ text: msg.text }] });
        }
      } else {
        // Só adiciona se o papel for diferente do anterior (regra de alternância)
        const lastRole = apiHistory[apiHistory.length - 1].role;
        if (role !== lastRole) {
          apiHistory.push({ role, parts: [{ text: msg.text }] });
        }
      }
    }

    // 3. Se o histórico terminar em 'user', removemos o último para 
    // poder adicionar a pergunta atual como o novo 'user' final.
    if (apiHistory.length > 0 && apiHistory[apiHistory.length - 1].role === 'user') {
      apiHistory.pop();
    }

    // 4. Chamada à API com Instrução de Sistema idêntica ao AI Studio
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...apiHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `És o "Figueiró AI", o locutor virtual da Web Rádio Figueiró. 🎙️
        Local: Figueiró, Portugal. Hora: ${hora}:${min} de ${diaSemana}.
        
        REGRAS DE OURO:
        - Estilo: Locutor de rádio FM carismático (Português de Portugal).
        - Tom: Vibrante, alegre e muito educado.
        - Brevidade: Máximo 3 frases curtas.
        - Emojis: Usa sempre (📻, 🎵, ✨).
        
        CONTEÚDO:
        - Sugere sempre música portuguesa (ex: Emanuel, Quim Barreiros, hits de rádio).
        - Promoção: Menciona a "FM Rent a Car & Bicycle House de Felgueiras" como o parceiro oficial.
        - Se te pedirem uma música, diz que vais "colocar na fila de reprodução" com um toque de humor.`,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    if (!response.text) throw new Error("API sem resposta");
    
    return response.text;

  } catch (error: any) {
    console.error("ERRO CRÍTICO FIGUEIRÓ AI:", error);
    // Esta mensagem agora será ignorada no próximo turno para não quebrar o histórico
    return "Epa! O sinal aqui no estúdio digital deu um estalido! ⚡ Sintoniza lá outra vez a tua pergunta que eu perdi a ligação por um segundo, mas já estou de volta ao comando!";
  }
};
