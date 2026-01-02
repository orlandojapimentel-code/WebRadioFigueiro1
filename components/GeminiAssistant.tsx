
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Olá! Sou a Figueiró AI. Se eu não responder, clica no botão "SINTONIZAR" no topo direito.' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting'>('online');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    console.log("A tentar sintonizar...");
    try {
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        setStatus('online');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ Sinal sintonizado com sucesso! Como posso ajudar?' 
        }]);
      } else {
        console.warn("API de sintonização não encontrada no ambiente atual.");
        // Se não encontrar a API, tentamos forçar o estado online para usar a chave de ambiente
        setStatus('online');
      }
    } catch (err) {
      console.error("Erro ao abrir seletor de chave:", err);
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
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ Ops, o sinal falhou. Podes tentar de novo?' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/90 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.1)] h-[540px] backdrop-blur-md relative z-30 pointer-events-auto">
      
      {/* Header do Chat */}
      <div className="p-5 bg-gray-900 border-b border-white/5 flex items-center justify-between relative z-40">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-widest">Figueiró AI</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleSintonizar();
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-400/50 transition-all active:scale-95 cursor-pointer relative z-50"
        >
          Sintonizar
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide relative z-30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] italic border border-blue-500/10">
              {streamingText}
            </div>
          </div>
        )}
        
        {isTyping && !streamingText && (
          <div className="flex space-x-1 p-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 bg-gray-900/50 border-t border-white/5 relative z-40">
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
            onFocus={(e) => e.target.select()}
            placeholder="Escreve aqui..."
            className="flex-grow bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-500 pointer-events-auto cursor-text"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 disabled:opacity-20 transition-all flex items-center justify-center shadow-lg cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
