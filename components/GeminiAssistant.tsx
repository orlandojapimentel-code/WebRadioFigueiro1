
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const defaultMessage: ChatMessage = { 
    role: 'model', 
    text: 'Sintonizados! Sou o Figueiró AI. 🎙️ Queres pedir uma música ou deixar uma dedicatória?' 
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "🎙️ Dedicatória", prompt: "Quero fazer uma dedicatória especial!" },
    { label: "🎵 Sugestão", prompt: "Dá-me uma sugestão de música portuguesa!" },
    { label: "🚗 FM Rent a Car", prompt: "Quais as vantagens da FM Rent a Car?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text };
    const historyBeforeSend = [...messages];
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const finalResponse = await getRadioAssistantStream(
        historyBeforeSend,
        text,
        (chunk) => setStreamingText(chunk)
      );
      
      setMessages(prev => [...prev, { role: 'model', text: finalResponse }]);
      setStreamingText('');
      setIsTyping(false);
    } catch (err) {
      // Em caso de erro, removemos a mensagem do utilizador que falhou para manter o chat limpo
      // e mostramos a mensagem de erro mas sem "poluir" o próximo pedido
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Ups! O sinal falhou um segundo, mas a música continua! 🎙️ Tenta perguntar outra vez ou pede uma música portuguesa!" 
      }]);
      setStreamingText('');
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([defaultMessage]);
    setStreamingText('');
    setIsTyping(false);
  };

  return (
    <div className="bg-gray-950/60 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-blue-500/40 h-[450px]">
      {/* Topo Estúdio */}
      <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-900 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
              <svg className={`w-5 h-5 text-white ${isTyping ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            {isTyping && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">Figueiró AI</h4>
            <div className="flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500' : 'bg-green-400 animate-pulse'}`}></span>
              <span className="text-[9px] text-blue-100 font-bold uppercase tracking-wider">
                {isTyping ? 'No Ar • A Responder' : 'Em Direto • Estúdio'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-grow overflow-y-auto p-5 space-y-5 scrollbar-hide bg-black/10">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[88%] rounded-[1.4rem] px-4 py-3 text-xs leading-relaxed shadow-md ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none border-b border-blue-400/30' 
                : 'bg-gray-800/80 text-gray-100 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {/* Streaming Visual */}
        {streamingText && (
          <div className="flex flex-col items-start animate-in fade-in">
            <div className="max-w-[88%] bg-gray-800/90 text-blue-50 rounded-[1.4rem] rounded-tl-none border border-blue-500/20 px-4 py-3 text-xs leading-relaxed shadow-lg">
              {streamingText}
              <span className="inline-block w-1.5 h-4 bg-blue-500 ml-1.5 animate-pulse rounded-full"></span>
            </div>
          </div>
        )}

        {isTyping && !streamingText && (
          <div className="flex items-center space-x-3 bg-blue-600/10 rounded-full px-4 py-2 w-fit border border-blue-500/20">
            <div className="flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900/60 border-t border-white/5">
        <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-hide">
          {quickActions.map((q, i) => (
            <button key={i} onClick={() => handleSendMessage(q.prompt)} className="flex-shrink-0 bg-white/5 hover:bg-blue-600/30 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-bold text-blue-300 transition-all hover:scale-105 active:scale-95">
              {q.label}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Diz algo ao nosso estúdio..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()} 
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-20 shadow-xl group"
          >
            <svg className={`w-5 h-5 transition-transform ${isTyping ? '' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
