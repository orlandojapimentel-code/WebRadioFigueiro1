
import React, { useState, useRef, useEffect } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [view, setView] = useState<'chat' | 'form'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou a voz digital da Figueiró. Queres saber as notícias, pedir uma música ou apenas conversar? 🎙️' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      await getRadioAssistantStream(userMessage, (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = chunk;
          return newMessages;
        });
      });
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Ups! O meu sinal falhou. Podes tentar de novo? 📻' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = "351910270085";
    const text = encodeURIComponent("Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl overflow-hidden flex flex-col transition-all h-[500px]">
      
      {/* Header Dinâmico */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest leading-none">Figueiró AI</h4>
            <p className="text-[8px] opacity-70 font-bold uppercase tracking-tighter mt-1">Sempre Ligada</p>
          </div>
        </div>
        <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => setView('chat')}
            className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${view === 'chat' ? 'bg-white text-blue-600' : 'text-white/60 hover:text-white'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setView('form')}
            className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-white text-blue-600' : 'text-white/60 hover:text-white'}`}
          >
            Pedido
          </button>
        </div>
      </div>

      {view === 'chat' ? (
        <>
          <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-slate-50/50 dark:bg-transparent">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-[1.5rem] text-xs font-medium shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-white/5 text-slate-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-tl-none'
                }`}>
                  {msg.text || (isLoading && i === messages.length - 1 ? "..." : "")}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-900/40 border-t border-gray-100 dark:border-white/5">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreve à Figueiró AI..."
                className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-2xl px-5 py-3.5 text-xs focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-900 dark:text-white pr-12"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-grow overflow-y-auto p-6">
          <button 
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mb-6"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>Dedicatória WhatsApp</span>
          </button>
          
          <form className="cc_request_form space-y-4" data-username="orlando">
             <input type="text" name="request[artist]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-500" placeholder="Artista" />
             <input type="text" name="request[title]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-500" placeholder="Música" />
             <input type="text" name="request[sender]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-500" placeholder="Seu Nome" />
             <button type="button" data-type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest">Enviar Pedido</button>
          </form>
        </div>
      )}

      <div className="p-3 bg-gray-50 dark:bg-black/20 text-center">
        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest italic leading-none">Powered by Gemini AI Studio</p>
      </div>
    </div>
  );
};

export default GeminiAssistant;
