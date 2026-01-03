
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Olá! Sou a Figueiró AI. Estás pronto para pedir a tua música? ✨' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

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
      setIsOnline(true);
    } catch (err: any) {
      setIsTyping(false);
      setStreamingText('');
      setIsOnline(false);
      
      if (err.message === "MISSING_KEY") {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '📢 [AVISO ADMIN]: A chave API não foi detetada. Clique no botão "Redeploy" no painel do Vercel para ativar as mudanças que fez! 🛠️' 
        }]);
      } else if (err.message === "INVALID_KEY") {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '❌ [ERRO]: A chave API configurada no Vercel parece ser inválida. Verifique os caracteres.' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ O sinal está com interferência... Podes tentar novamente?' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/95 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(59,130,246,0.15)] h-[560px] backdrop-blur-xl relative z-[60]">
      
      <div className="p-5 bg-gray-900/80 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">
            {isOnline ? 'On Air' : 'Off Air'}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
              m.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none' 
                : 'bg-gray-800/90 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800/50 text-blue-300 text-[13px] italic border border-blue-500/20 animate-pulse">
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
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-20 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            {isTyping ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
