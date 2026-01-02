
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
    { label: "🎙️ Dedicatória", prompt: "Quero fazer uma dedicatória!" },
    { label: "🎵 Sugestão", prompt: "Dá-me um hit português!" },
    { label: "🚗 FM Rent a Car", prompt: "Fala-me da FM Rent a Car!" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      // Passamos um histórico vazio ou muito curto para evitar timeouts
      const result = await getRadioAssistantStream([], text, (chunk) => {
        setStreamingText(chunk);
      });
      
      setMessages(prev => [...prev, { role: 'model', text: result }]);
      setStreamingText('');
      setIsTyping(false);
    } catch (err) {
      // Se falhar, limpamos o estado e mostramos uma mensagem simpática
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Tivemos uma pequena interferência, mas a música não pára! 🎙️ Tenta perguntar outra vez, ouvinte!" 
      }]);
      setStreamingText('');
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gray-950/60 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl h-[450px]">
      <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-900 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-white">
          <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 ${isTyping ? 'animate-pulse' : ''}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest">Figueiró AI</h4>
            <span className="text-[8px] opacity-70 font-bold uppercase tracking-tighter">Estúdio em Direto</span>
          </div>
        </div>
        <button onClick={() => setMessages([defaultMessage])} className="text-white/40 hover:text-white transition-colors p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-none bg-gray-800 text-blue-100 text-xs animate-in fade-in">
              {streamingText}
              <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-white/5 space-y-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {quickActions.map((q, i) => (
            <button key={i} onClick={() => handleSendMessage(q.prompt)} className="whitespace-nowrap bg-white/5 hover:bg-blue-600/20 border border-white/10 rounded-full px-3 py-1 text-[9px] font-bold text-blue-300 transition-colors">
              {q.label}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-2">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder="Diz algo ao estúdio..."
            className="flex-grow bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/40"
          />
          <button type="submit" disabled={isTyping || !input.trim()} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
