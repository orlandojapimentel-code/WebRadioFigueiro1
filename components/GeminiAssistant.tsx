
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Sintonizados! Sou o Figueiró AI. 🎙️ Queres pedir uma música, criar uma dedicatória ou saber o que está a dar no ar? Lança o tema!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "🎙️ Dedicatória", prompt: "Quero fazer uma dedicatória especial para a minha família." },
    { label: "🎵 Sugestão", prompt: "Dá-me uma sugestão de música portuguesa para animar o dia!" },
    { label: "🚗 FM Rent a Car", prompt: "O que a FM Rent a Car tem para oferecer aos ouvintes?" }
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
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getRadioAssistantResponse(currentHistory, text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "O sinal está com um pouco de estática! Tenta de novo em 10 segundos." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="bg-gray-800/60 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-blue-500/40">
      {/* Cabeçalho Premium */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
          </div>
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-tight">Estúdio Digital</h4>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Assistente Figueiró AI</p>
          </div>
        </div>
      </div>

      {/* Mensagens com design de bolha melhorado */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-950/40">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-sm shadow-lg transition-all ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800/80 text-gray-100 rounded-bl-none border border-white/10'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex flex-col items-start">
             <div className="bg-gray-800/60 rounded-2xl px-5 py-3 rounded-bl-none border border-blue-500/20 flex items-center space-x-2">
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></span>
                </span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ligando ao Satélite...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ações Rápidas Estilizadas */}
      <div className="px-4 py-3 flex overflow-x-auto space-x-2 scrollbar-hide bg-gray-900/40 border-t border-white/5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(action.prompt)}
            className="flex-shrink-0 bg-white/5 hover:bg-blue-600/40 border border-white/10 rounded-full px-4 py-2 text-[10px] font-black text-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input de Chat */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900/60 flex space-x-2 items-center">
        <input 
          type="text" 
          placeholder="Diz algo ao estúdio..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-grow bg-gray-800/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-500"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="h-14 w-14 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-30 flex items-center justify-center shadow-lg active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
