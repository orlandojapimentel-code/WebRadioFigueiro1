
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Olá! Sou a Figueiró AI. Estás pronto para pedir a tua música?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting'>('online');
  const [isStudio, setIsStudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => {
    const win = window as any;
    const aiStudio = win.aistudio || win.parent?.aistudio;
    setIsStudio(!!aiStudio);

    if (aiStudio?.hasSelectedApiKey) {
      aiStudio.hasSelectedApiKey().then((has: boolean) => {
        if (!has) setStatus('waiting');
      });
    }
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const result = await getRadioAssistantStream(userMsg, (chunk) => {
        setStreamingText(chunk);
      });
      setMessages(prev => [...prev, { role: 'model', text: result }]);
      setStreamingText('');
      setIsTyping(false);
    } catch (err: any) {
      setIsTyping(false);
      setStreamingText('');
      
      let errorResponse = "🎙️ O sinal está com interferência. Podes repetir?";
      
      if (err.message === "MISSING_KEY") {
        errorResponse = "⚠️ DIAGNÓSTICO: A chave de API não foi encontrada no servidor (Vercel). Verifique se criou a variável API_KEY.";
      } else if (err.message === "INVALID_KEY") {
        errorResponse = "❌ ERRO DE CHAVE: A chave configurada no Vercel foi REJEITADA pelo Google. Verifique se copiou o código completo em aistudio.google.com";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorResponse }]);
    }
  };

  const handleAction = async () => {
    const win = window as any;
    const aiStudio = win.aistudio || win.parent?.aistudio;
    if (aiStudio?.openSelectKey) {
      await aiStudio.openSelectKey();
      setStatus('online');
      setMessages([{ role: 'model', text: '🎙️ Sintonizado! Como te posso ajudar?' }]);
    }
  };

  return (
    <div className="bg-gray-950/95 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(59,130,246,0.15)] h-[560px] backdrop-blur-xl relative z-[60]">
      
      <div className="p-5 bg-gray-900/80 border-b border-white/5 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800/80 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-300 text-[13px] italic border border-blue-500/20">
              {streamingText}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {status === 'waiting' && isStudio && (
        <div className="absolute inset-0 bg-gray-950/95 z-[100] flex flex-col items-center justify-center p-8 text-center">
           <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
             <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
           </div>
           <button onClick={handleAction} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg">Sintonizar</button>
        </div>
      )}

      <div className="p-4 bg-gray-900/90 border-t border-white/5 relative z-50">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Diz algo à Figueiró AI..."
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
