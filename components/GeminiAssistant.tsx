
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
  const [showSyncButton, setShowSyncButton] = useState(false);
  const [isAistudio, setIsAistudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detecta se estamos no ambiente onde o botão "Sintonizar" funciona
    const checkEnv = async () => {
      const hasAiStudio = typeof window !== 'undefined' && (window as any).aistudio;
      setIsAistudio(!!hasAiStudio);
      
      if (hasAiStudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setShowSyncButton(!hasKey);
      }
    };
    checkEnv();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleAction = async () => {
    if (isAistudio && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setShowSyncButton(false);
    } else {
      // Se não for AI Studio, o "Sintonizar" funciona como um reset de chat
      setMessages([{ role: 'model', text: '🎙️ A reiniciar ligação com o estúdio em Figueiró... Olá de novo!' }]);
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
      let errorMsg = "🎙️ Oops! Algo correu mal. Tenta novamente em instantes.";
      
      if (err.message === "SINTONIA_PERDIDA") {
        if (isAistudio) {
          errorMsg = "🎙️ Perdi a sintonia! Clica em 'SINTONIZAR' no topo para me religares.";
          setShowSyncButton(true);
        } else {
          errorMsg = "🎙️ O sinal está fraco neste momento. Verifica se a rádio está online e tenta de novo!";
        }
      }
      
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
      setStreamingText('');
      setIsTyping(false);
    }
  };

  const sugestoes = [
    "O que toca agora?",
    "Quero deixar um abraço",
    "Sugere música de Portugal",
    "Fala-me de Figueiró"
  ];

  return (
    <div className="bg-gray-950/80 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl h-[520px] backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 bg-blue-600/10 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-950 ${showSyncButton ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></div>
          </div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        
        <button 
          onClick={handleAction}
          className={`text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-widest transition-all ${
            showSyncButton 
              ? 'bg-yellow-500 text-black animate-pulse shadow-lg shadow-yellow-500/20' 
              : 'bg-white/5 text-blue-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {showSyncButton ? 'Sintonizar' : 'Estúdio Online'}
        </button>
      </div>

      {/* Chat */}
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

      {/* Input */}
      <div className="p-4 bg-gray-950/80 border-t border-white/5 space-y-4 shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sugestoes.map((s) => (
            <button 
              key={s} 
              onClick={() => handleSend(s)}
              className="whitespace-nowrap bg-blue-500/5 hover:bg-blue-500/15 border border-blue-500/10 rounded-full px-4 py-2 text-[10px] font-bold text-blue-300 transition-all hover:scale-105 active:scale-95"
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
