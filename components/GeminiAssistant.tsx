
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const defaultMessage: ChatMessage = { 
    role: 'model', 
    text: 'Sintonizados! Sou o Figueiró AI. 🎙️ Queres pedir uma música, criar uma dedicatória ou saber o que está a dar no ar?' 
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultMessage]);
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

  const resetChat = () => {
    setMessages([defaultMessage]);
    setInput('');
  };

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
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "O sinal falhou por um segundo! Tenta de novo em 10 segundos." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="bg-gray-900/70 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/40">
      {/* Header Estilizado com Botão Reset */}
      <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-900 flex items-center justify-between relative">
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </div>
          <div>
            <h4 className="font-black text-white text-[11px] uppercase tracking-widest">Estúdio Figueiró</h4>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] text-blue-200 font-bold uppercase tracking-tighter">Locutor Virtual Ativo</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={resetChat}
          title="Limpar Conversa"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      {/* Área de Mensagens */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-950/30">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[92%] rounded-[1.3rem] px-4 py-3 text-sm leading-relaxed shadow-xl ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                  : 'bg-gray-800/80 text-gray-100 rounded-tl-none border border-white/10'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-3 bg-white/5 rounded-full px-4 py-2.5 w-fit border border-white/5 shadow-lg animate-in fade-in zoom-in duration-300">
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'200ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'400ms'}}></div>
            </div>
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Sintonizando resposta...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Atalhos Rápidos */}
      <div className="px-4 py-3 flex overflow-x-auto space-x-2 scrollbar-hide border-t border-white/5 bg-gray-900/40">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(action.prompt)}
            className="flex-shrink-0 bg-white/5 hover:bg-blue-600/40 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black text-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input de Chat */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900/80 flex space-x-2 border-t border-white/5">
        <input 
          type="text" 
          placeholder="Diz algo ao nosso estúdio..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-grow bg-gray-800 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="bg-blue-600 text-white w-14 h-14 rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center disabled:opacity-20 shadow-lg active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
