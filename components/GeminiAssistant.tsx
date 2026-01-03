
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Olá! Sou a Figueiró AI v2.1. Estás pronto para pedir a tua música? ✨' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'tuning' | 'error'>('online');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    try {
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setConnectionStatus('online');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '📻 Sinal recuperado! Já podes falar comigo. O que queres ouvir?' 
        }]);
      }
    } catch (err) {
      console.error("Erro na sintonização manual:", err);
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
      setConnectionStatus('online');
    } catch (err: any) {
      setIsTyping(false);
      setStreamingText('');
      
      if (err.message === "MISSING_KEY" || err.message === "INVALID_KEY") {
        setConnectionStatus('tuning');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '📡 Peço desculpa, o meu sinal de rádio está a ser configurado. Tenta novamente dentro de alguns minutos ou clica em Sintonizar! 🛠️' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ Estás a chegar com um pouco de estática... Podes repetir o pedido?' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/95 rounded-[2.5rem] border border-indigo-500/30 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(79,70,229,0.15)] h-[580px] backdrop-blur-xl relative z-[60]">
      
      {/* Cabeçalho Novo (Indigo) */}
      <div className="p-5 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI v2.1</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[8px] font-black uppercase tracking-widest">
            {connectionStatus === 'online' ? 'Em Direto' : 'Sintonizando...'}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-black/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-gray-800/95 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {connectionStatus === 'tuning' && (
          <div className="flex justify-center pt-2">
            <button 
              onClick={handleSintonizar}
              className="bg-white text-indigo-950 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
            >
              Sintonizar Manualmente
            </button>
          </div>
        )}

        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-indigo-900/30 text-indigo-200 text-[13px] border border-indigo-500/20">
              {streamingText}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-gray-900/95 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Diz algo à Figueiró AI..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-indigo-500 disabled:opacity-20 transition-all shadow-lg shadow-indigo-600/20"
          >
            {isTyping ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
            )}
          </button>
        </form>
        <div className="mt-2 flex justify-center opacity-30">
          <div className="h-0.5 w-1 bg-white mx-0.5 rounded-full"></div>
          <div className="h-0.5 w-1 bg-white mx-0.5 rounded-full"></div>
          <div className="h-0.5 w-1 bg-white mx-0.5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
