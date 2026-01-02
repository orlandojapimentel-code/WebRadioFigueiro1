
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o Figueiró AI, a voz digital desta rádio. 👋 Que tal uma dedicatória especial ou uma sugestão musical para este momento?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "🎙️ Pedir Dedicatória", prompt: "Quero criar uma dedicatória especial para um amigo." },
    { label: "🎵 Sugestão Musical", prompt: "Sugere-me música para animar o meu dia!" },
    { label: "📅 Programação", prompt: "Qual é a programação de hoje?" }
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
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mandamos o histórico (excluindo a primeira saudação estática se quiseres, mas aqui vai tudo)
    const responseText = await getRadioAssistantResponse(messages, text);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="bg-gray-800/90 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-md">
      {/* Header do Chat */}
      <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
              <svg className="w-7 h-7 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
          </div>
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-tight">Figueiró AI</h4>
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Locutor Virtual Ativo</p>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-950/20">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-white/5'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex flex-col items-start animate-pulse">
             <div className="bg-gray-800 text-blue-400 rounded-2xl px-4 py-3 rounded-bl-none text-xs flex items-center space-x-2 border border-blue-500/10">
               <span className="flex space-x-1">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </span>
               <span className="font-black uppercase tracking-widest text-[9px]">A Sintonizar...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - Onde o realismo acontece ao facilitar a interação */}
      <div className="px-4 py-2 flex overflow-x-auto space-x-2 scrollbar-hide bg-gray-900/40 border-t border-white/5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(action.prompt)}
            className="flex-shrink-0 bg-white/5 hover:bg-blue-600/20 border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-bold text-gray-300 transition-all hover:border-blue-500/30 active:scale-95"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900/60 flex space-x-2 items-center">
        <input 
          type="text" 
          placeholder="Fale com o nosso locutor..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-grow bg-gray-800 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="h-12 w-12 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:bg-gray-700 flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
