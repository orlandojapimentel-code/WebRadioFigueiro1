
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio ligado aqui em Figueiró! Sou a Figueiró AI. Como te posso ajudar hoje?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [needsSync, setNeedsSync] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        setNeedsSync(false);
        setMessages([{ role: 'model', text: '🎙️ Sintonia recuperada! Vamos continuar a conversa de Figueiró para o mundo.' }]);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("A funcionalidade de IA requer uma API Key configurada no servidor da Web Rádio Figueiró.");
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg = text;
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
      setNeedsSync(false);
    } catch (err: any) {
      console.error("Erro no Chat:", err.message);
      let errorMsg = "🎙️ O sinal está com interferências. Tenta de novo em instantes!";
      
      if (err.message === "SINTONIA_PERDIDA") {
        errorMsg = "🎙️ A sintonia da IA foi perdida. Se és o administrador, verifica a chave API. Se és ouvinte, curte a música no player abaixo!";
        setNeedsSync(true);
      }
      
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
      setStreamingText('');
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gray-950/80 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl h-[520px] backdrop-blur-xl">
      <div className="p-4 bg-blue-600/10 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
          </div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        
        <button 
          onClick={handleSintonizar}
          className={`text-[8px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all ${
            needsSync 
              ? 'bg-yellow-500 text-black animate-pulse' 
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}
        >
          {needsSync ? 'Sintonizar' : 'Estúdio Online'}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-gradient-to-b from-transparent to-blue-900/5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-xl ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] border border-blue-500/20 shadow-lg">
              {streamingText}<span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-gray-950/80 border-t border-white/5 space-y-4 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder="Mensagem para Figueiró..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
          />
          <button 
            type="submit" disabled={!input.trim() || isTyping} 
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
