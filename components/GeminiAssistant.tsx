
import React, { useState, useEffect, useRef } from 'react';
import { generateDedication, suggestPlaylistByMood } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o assistente inteligente da Rádio Figueiró. Queres que escreva uma dedicatória ou preferes uma sugestão de música para o teu estado de espírito?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      let aiResponse = "";
      // Lógica de decisão simples baseada em palavras-chave
      const lowerInput = userText.toLowerCase();
      if (lowerInput.includes('dedicatória') || lowerInput.includes('dedicar') || lowerInput.includes('mensagem')) {
         aiResponse = await generateDedication(userText);
      } else {
         aiResponse = await suggestPlaylistByMood(userText);
      }

      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Ocorreu um erro ao processar o seu pedido. Tente novamente em instantes." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-xl">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Assistente Figueiró AI</h4>
            <p className="text-[9px] text-white/70 uppercase tracking-widest font-black">Gemini 3 Flash</p>
          </div>
        </div>
      </div>

      <div className="h-72 overflow-y-auto p-4 space-y-4 scrollbar-hide flex flex-col bg-gray-900/40">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`max-w-[85%] rounded-2xl p-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white self-end ml-auto rounded-br-none shadow-lg' 
                : 'bg-gray-700 text-gray-200 self-start rounded-bl-none border border-white/5'
            }`}
          >
            {m.text}
          </div>
        ))}
        {isTyping && (
           <div className="bg-gray-700 text-gray-400 self-start rounded-2xl p-3 rounded-bl-none text-xs flex items-center space-x-2 border border-white/5">
             <div className="flex space-x-1">
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
             <span>A sintonizar resposta...</span>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-gray-800 border-t border-white/5 flex space-x-2">
        <input 
          type="text" 
          placeholder="Peça uma dedicatória ou diga como se sente..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-grow bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:bg-gray-600 transform active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
