
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
    { label: "🚗 FM Rent a Car", prompt: "Fala-me sobre as vantagens dos vossos parceiros da FM Rent a Car." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Guardamos o histórico ANTES de adicionar a nova mensagem do user
    // para o serviço tratar a inclusão da nova mensagem corretamente.
    const historyBeforeNewMessage = [...messages];
    
    const userMessage: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getRadioAssistantResponse(historyBeforeNewMessage, text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "O sinal está com muita interferência agora! Tenta de novo em 5 segundos." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="bg-gray-800/90 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-blue-500/40">
      {/* Cabeçalho */}
      <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
              <svg className="w-7 h-7 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full shadow-sm"></div>
          </div>
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-tight">Figueiró AI</h4>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-80">No Ar • Estúdio Digital</p>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-950/30">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none font-medium' 
                  : 'bg-gray-800 text-gray-100 rounded-bl-none border border-white/5 leading-relaxed'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex flex-col items-start animate-pulse">
             <div className="bg-gray-800/80 text-blue-400 rounded-2xl px-5 py-3 rounded-bl-none text-[10px] flex items-center space-x-3 border border-blue-500/20 shadow-lg">
               <div className="flex space-x-1.5">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
               <span className="font-black uppercase tracking-[0.2em]">Processando Sinal...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ações Rápidas */}
      <div className="px-4 py-3 flex overflow-x-auto space-x-2 scrollbar-hide bg-gray-900/40 border-t border-white/5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(action.prompt)}
            className="flex-shrink-0 bg-white/5 hover:bg-blue-600/30 border border-white/10 rounded-full px-4 py-2 text-[10px] font-black text-gray-300 transition-all active:scale-95 shadow-sm whitespace-nowrap"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900/80 flex space-x-2 items-center">
        <input 
          type="text" 
          placeholder="Escreve ao locutor..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-grow bg-gray-800 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="h-14 w-14 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center shadow-xl shadow-blue-600/20 active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
