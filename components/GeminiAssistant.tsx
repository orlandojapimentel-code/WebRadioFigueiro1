
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio ligado em Figueiró! Estamos a aguardar sinal. Se vir o botão "Sintonizar", clique para ligar a IA ao estúdio.' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting'>('waiting');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Verificação inicial de chave
  useEffect(() => {
    const verifyKey = async () => {
      try {
        if ((window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (hasKey || process.env.API_KEY) {
            setStatus('online');
          }
        }
      } catch (e) {
        console.log("A aguardar sintonização manual...");
      }
    };
    verifyKey();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Seguindo a regra: assumir sucesso após abrir o diálogo
      setStatus('online');
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: '🎙️ Sinal recuperado! A Figueiró AI está agora em direto consigo. Como posso ajudar?' 
      }]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const result = await getRadioAssistantStream(text, (chunk) => {
        setStreamingText(chunk);
      });
      setMessages(prev => [...prev, { role: 'model', text: result }]);
      setStreamingText('');
      setIsTyping(false);
      setStatus('online');
    } catch (err: any) {
      setIsTyping(false);
      setStreamingText('');
      
      if (err.message === "AUTH_ERROR") {
        setStatus('waiting');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ O sinal caiu! Clique no botão amarelo "SINTONIZAR" no topo para voltar ao ar.' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ Temos interferência no sinal. Tente novamente em instantes.' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/90 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.1)] h-[540px] backdrop-blur-2xl transition-all duration-700">
      {/* Header do Chat */}
      <div className="p-5 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
              status === 'online' ? 'bg-blue-500/20 border-blue-400/30' : 'bg-yellow-500/20 border-yellow-400/30'
            }`}>
              <svg className={`w-5 h-5 ${status === 'online' ? 'text-blue-400 animate-pulse' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 border-2 border-gray-950 rounded-full ${
              status === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'
            }`}></span>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] leading-none">Figueiró AI</h4>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${
              status === 'online' ? 'text-blue-400' : 'text-yellow-500'
            }`}>
              {status === 'online' ? 'No Ar em Direto' : 'Sinal em Espera'}
            </span>
          </div>
        </div>
        
        {status === 'waiting' && (
          <button 
            onClick={handleSintonizar}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all animate-pulse shadow-lg shadow-yellow-500/30"
          >
            Sintonizar
          </button>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-grow overflow-y-auto p-6 space-y-5 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[13px] ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] italic">
              {streamingText}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-5 bg-gray-950/50 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-3">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            disabled={status === 'waiting' || isTyping}
            placeholder={status === 'waiting' ? "Sintonize para começar..." : "Escreva ao estúdio..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
          />
          <button 
            type="submit" disabled={!input.trim() || isTyping || status === 'waiting'}
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
