
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Sintonizados! Sou o Figueiró AI. 🎙️ Queres pedir uma música, criar uma dedicatória ou saber o que está a dar no ar?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "🎙️ Dedicatória", prompt: "Quero fazer uma dedicatória especial para a minha família." },
    { label: "🎵 Sugestão", prompt: "Dá-me uma sugestão de música portuguesa para agora!" },
    { label: "🚗 FM Rent a Car", prompt: "Quais as vantagens da FM Rent a Car?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text };
    const historySnapshot = [...messages];
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getRadioAssistantResponse(historySnapshot, text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "O transmissor falhou por um segundo! Tenta de novo, ouvinte." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="bg-gray-900/60 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/40 group">
      {/* Header Estilizado */}
      <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-between relative">
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest">Estúdio Figueiró</h4>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] text-blue-200 font-bold uppercase">Assistente IA Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-950/20">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}
          >
            <div 
              className={`max-w-[90%] rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed shadow-lg ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                  : 'bg-gray-800/90 text-gray-100 rounded-tl-none border border-white/5'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 w-fit">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'200ms'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'400ms'}}></div>
            </div>
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Locutor a pensar...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Atalhos Rápidos */}
      <div className="px-4 py-2 flex overflow-x-auto space-x-2 scrollbar-hide border-t border-white/5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(action.prompt)}
            className="flex-shrink-0 bg-white/5 hover:bg-blue-600/30 border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-bold text-blue-300 transition-all active:scale-95"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-gray-900/80 flex space-x-2">
        <input 
          type="text" 
          placeholder="Pergunta algo ao locutor..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 placeholder:text-gray-600"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="bg-blue-600 text-white w-12 h-12 rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center disabled:opacity-20 shadow-lg active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
