
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio ligado aqui em Figueiró! Sou a Figueiró AI, a tua melhor companhia digital. Como te posso ajudar hoje?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Verifica se precisa de sintonizar logo ao carregar
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setShowKeyInfo(!hasKey);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Após abrir o diálogo, assumimos que o utilizador vai configurar
      setShowKeyInfo(false);
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
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "🎙️ Oops! Parece que perdi a sintonia. Clica no botão 'SINTONIZAR' ali em cima para me ligares de novo ao servidor da Google!" 
      }]);
      setShowKeyInfo(true);
      setIsTyping(false);
    }
  };

  const sugestoes = [
    "O que está a dar?",
    "Quero deixar um abraço",
    "Sugere música de Portugal",
    "Fala-me de Figueiró"
  ];

  return (
    <div className="bg-gray-950/80 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl h-[520px] backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 bg-blue-600/10 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
          </div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        
        {/* Botão Sintonizar - Agora mais persistente se necessário */}
        {showKeyInfo ? (
          <button 
            onClick={handleSintonizar}
            className="text-[9px] bg-yellow-500 text-black px-4 py-1.5 rounded-full font-black uppercase hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"
          >
            Sintonizar
          </button>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Sintonizado</span>
          </div>
        )}
      </div>

      {/* Janela de Chat */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-gradient-to-b from-transparent to-blue-900/5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-xl ${
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
            <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] border border-blue-500/20 shadow-lg">
              {streamingText}
              <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}

        {isTyping && !streamingText && (
          <div className="flex space-x-1.5 p-3">
            <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Sugestões e Input */}
      <div className="p-4 bg-gray-950/80 border-t border-white/5 space-y-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sugestoes.map((s) => (
            <button 
              key={s} 
              onClick={() => handleSend(s)}
              className="whitespace-nowrap bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full px-4 py-2 text-[10px] font-bold text-blue-300 transition-all hover:scale-105 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder="Fala com o locutor..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping} 
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-20 active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
