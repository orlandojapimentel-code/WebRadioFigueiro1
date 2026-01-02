
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const defaultMessage: ChatMessage = { 
    role: 'model', 
    text: 'Sintonizados! Sou o Figueiró AI. 🎙️ Queres pedir uma música ou uma dedicatória?' 
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "🎙️ Dedicatória", prompt: "Quero fazer uma dedicatória!" },
    { label: "🎵 Sugestão", prompt: "Sugere-me um hit português!" },
    { label: "🚗 FM Rent a Car", prompt: "Quais as vantagens da FM Rent a Car?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingText]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text };
    const historySnapshot = [...messages];
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      await getRadioAssistantStream(
        historySnapshot, 
        text, 
        (currentFullText) => {
          setStreamingText(currentFullText);
        }
      ).then((finalText) => {
        setMessages(prev => [...prev, { role: 'model', text: finalText }]);
        setStreamingText('');
        setIsTyping(false);
      });
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Ups! Tivemos uma pequena interferência no sinal. 📻 Tenta perguntar outra vez, ouvinte!" 
      }]);
      setStreamingText('');
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([defaultMessage]);
    setInput('');
    setStreamingText('');
    setIsTyping(false);
  };

  return (
    <div className="bg-gray-950/40 rounded-[2.5rem] border border-blue-500/20 overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-blue-500/40">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </div>
          <div>
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.2em]">Figueiró AI</h4>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] text-blue-200 font-bold uppercase">Em Direto</span>
            </div>
          </div>
        </div>
        <button onClick={resetChat} className="text-white/40 hover:text-white transition-colors p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      {/* Chat Area */}
      <div className="h-72 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1`}>
            <div className={`max-w-[85%] rounded-[1.2rem] px-4 py-2.5 text-xs leading-relaxed shadow-lg ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-100 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {/* Resposta em Streaming */}
        {streamingText && (
          <div className="flex flex-col items-start animate-in fade-in">
            <div className="max-w-[85%] bg-gray-800 text-gray-100 rounded-[1.2rem] rounded-tl-none border border-white/5 px-4 py-2.5 text-xs leading-relaxed shadow-lg">
              {streamingText}
              <span className="inline-block w-1 h-3 bg-blue-400 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}

        {isTyping && !streamingText && (
          <div className="flex items-center space-x-2 bg-blue-500/10 rounded-full px-3 py-1.5 w-fit border border-blue-500/20">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[8px] font-black text-blue-400 uppercase">Sintonizando...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Actions */}
      <div className="p-3 bg-gray-900 border-t border-white/5">
        <div className="flex overflow-x-auto space-x-2 pb-3 scrollbar-hide">
          {quickActions.map((q, i) => (
            <button key={i} onClick={() => handleSendMessage(q.prompt)} className="flex-shrink-0 bg-white/5 hover:bg-blue-600/30 border border-white/10 rounded-full px-3 py-1 text-[9px] font-bold text-blue-300 transition-all active:scale-95">
              {q.label}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Envia uma mensagem ao estúdio..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <button type="submit" disabled={isTyping || !input.trim()} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-20 shadow-lg active:scale-90">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
