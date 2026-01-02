
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio ligado! Sou o teu locutor digital. Queres saber o que temos para ti hoje?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
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
        text: "🎙️ Nota: Para que eu possa responder com inteligência, clica em 'Sintonizar' acima (requer Chave API Google)." 
      }]);
      setShowKeyInfo(true);
      setIsTyping(false);
    }
  };

  const sugestoes = [
    "Que programa dá agora?",
    "Sugere música portuguesa",
    "Quem é o DJ do Night Grooves?",
    "Manda um abraço para Felgueiras!"
  ];

  return (
    <div className="bg-gray-900 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl h-[520px]">
      {/* Header */}
      <div className="p-4 bg-blue-600/10 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
          </div>
          <span className="text-white font-bold text-xs uppercase tracking-widest">Estúdio Figueiró</span>
        </div>
        {showKeyInfo && (
          <button 
            onClick={handleSintonizar}
            className="text-[9px] bg-yellow-500 text-black px-3 py-1 rounded-full font-bold uppercase hover:bg-yellow-400 transition-colors"
          >
            Sintonizar
          </button>
        )}
      </div>

      {/* Janela de Chat */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-300 rounded-tl-none border border-white/5 shadow-lg'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-200 text-[13px] border border-blue-500/20 shadow-lg shadow-blue-500/5">
              {streamingText}
              <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}

        {isTyping && !streamingText && (
          <div className="flex space-x-1 p-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Sugestões e Input */}
      <div className="p-4 bg-gray-950/50 space-y-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sugestoes.map((s) => (
            <button 
              key={s} 
              onClick={() => handleSend(s)}
              className="whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-[10px] text-blue-400 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder="Fala com o locutor..."
            className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/30"
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
