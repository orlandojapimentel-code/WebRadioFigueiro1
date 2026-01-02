
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio ligado em Figueiró! Sou a Figueiró AI. Em que posso ajudar?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [needsSync, setNeedsSync] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Verifica se a chave do Vercel está ativa
  useEffect(() => {
    const checkKey = () => {
      const apiKey = process.env.API_KEY;
      const isConfigured = apiKey && apiKey !== "undefined" && apiKey.length > 10;
      setNeedsSync(!isConfigured);
    };
    checkKey();
    // Re-verificar ocasionalmente caso o redeploy ainda esteja a processar
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSintonizar = async () => {
    if (typeof (window as any).aistudio?.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      setNeedsSync(false);
    } else {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: '📻 Se já configurou no Vercel, aguarde 1 minuto pelo fim do Deployment.' 
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
    } catch (err: any) {
      if (err.message === "SINTONIA_PERDIDA") {
        setNeedsSync(true);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ Sinal da IA interrompido. Verifique a chave no painel de controlo.' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ Houston, temos um problema técnico. Tente de novo!' }]);
      }
      setIsTyping(false);
      setStreamingText('');
    }
  };

  return (
    <div className="bg-gray-950/80 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl h-[520px] backdrop-blur-xl transition-all duration-500">
      <div className="p-4 bg-blue-600/10 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            {!needsSync && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-950 rounded-full animate-pulse"></span>}
          </div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        
        <button 
          onClick={handleSintonizar}
          className={`text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-widest transition-all duration-500 ${
            needsSync 
              ? 'bg-yellow-500 text-black animate-bounce shadow-lg shadow-yellow-500/20' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}
        >
          {needsSync ? '⚠️ Sintonizar' : '● Online'}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-gradient-to-b from-transparent to-blue-900/5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] border border-blue-500/20 italic">
              {streamingText}<span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-gray-950/80 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder={needsSync ? "A aguardar sinal..." : "Mensagem para o estúdio..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <button 
            type="submit" disabled={!input.trim() || isTyping || needsSync} 
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
