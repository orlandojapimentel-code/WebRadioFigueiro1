
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Olá! Sou a Figueiró AI. Estás pronto para pedir a tua música?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting'>('online');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Tenta verificar se já tem chave ao carregar
  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio?.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) setStatus('waiting');
      }
    };
    checkKey();
  }, []);

  const handleSintonizar = async () => {
    console.log("Sintonizando rádio...");
    const win = window as any;
    if (win.aistudio?.openSelectKey) {
      try {
        await win.aistudio.openSelectKey();
        // Seguindo as instruções: assumir sucesso e prosseguir imediatamente
        setStatus('online');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '✅ Estúdio da Figueiró AI pronto! Para começarmos a falar, preciso que sintonize o sinal de dados do Google.' 
        }]);
      } catch (err) {
        console.error("Erro ao abrir seletor:", err);
      }
    } else {
      setStatus('online');
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const result = await getRadioAssistantStream(userMsg, (chunk) => {
        setStreamingText(chunk);
      });
      setMessages(prev => [...prev, { role: 'model', text: result }]);
      setStreamingText('');
      setIsTyping(false);
    } catch (err: any) {
      setIsTyping(false);
      setStreamingText('');
      
      if (err.message === "AUTH_ERROR") {
        setStatus('waiting');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '⚠️ Precisamos sintonizar o sinal. Por favor, clica no botão "SINTONIZAR" no topo do chat.' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ O sinal falhou momentaneamente. Tenta de novo!' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/95 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(59,130,246,0.15)] h-[560px] backdrop-blur-xl relative z-[60] pointer-events-auto">
      
      {/* Header do Chat */}
      <div className="p-5 bg-gray-900/80 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_10px_#eab308]'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        
        <button 
          onClick={handleSintonizar}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-400/30 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
        >
          {status === 'online' ? 'Sintonizar' : '⚠️ Sintonizar Agora'}
        </button>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide relative">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800/80 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
              {/* Se a mensagem for de erro de sintonização, adiciona botão direto */}
              {(m.text.includes('sintonizar o sinal') || m.text.includes('sintonizar Agora')) && (
                <button 
                  onClick={handleSintonizar}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-lg font-black text-[10px] uppercase transition-all shadow-lg"
                >
                  Sintonizar Sinal Agora
                </button>
              )}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] italic border border-blue-500/20">
              {streamingText}
            </div>
          </div>
        )}
        
        {isTyping && !streamingText && (
          <div className="flex space-x-1.5 p-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 bg-gray-900/90 border-t border-white/5">
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if (input.trim()) handleSend(input); 
          }} 
          className="flex gap-2"
        >
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={status === 'online' ? "Diz algo ao estúdio..." : "Sintoniza primeiro..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all flex items-center justify-center shadow-xl shadow-blue-900/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Overlay Central de Bloqueio - Garante que o clique seja registado */}
      {status === 'waiting' && (
        <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px] z-[70] flex items-center justify-center p-8 text-center">
           <div className="bg-gray-900 border border-blue-500/50 p-8 rounded-[2.5rem] shadow-2xl">
              <p className="text-white text-sm font-bold mb-6">Sinal de dados não sintonizado.</p>
              <button 
                onClick={handleSintonizar}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl border-2 border-blue-400 transition-all active:scale-95"
              >
                Sintonizar Sinal Agora
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
