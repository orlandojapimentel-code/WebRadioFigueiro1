
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
  const [isOpeningKey, setIsOpeningKey] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting'>('online');
  const [isStudio, setIsStudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Verifica o ambiente e o estado da chave
  useEffect(() => {
    const win = window as any;
    const aiStudio = win.aistudio || win.parent?.aistudio;
    const hasStudioAPI = !!aiStudio;
    setIsStudio(hasStudioAPI);

    const checkKeyStatus = async () => {
      if (hasStudioAPI && aiStudio.hasSelectedApiKey) {
        try {
          const hasKey = await aiStudio.hasSelectedApiKey();
          if (!hasKey) setStatus('waiting');
        } catch (e) {
          console.error("Erro ao verificar chave no Studio:", e);
        }
      }
    };
    checkKeyStatus();
  }, []);

  const handleSintonizar = async () => {
    if (isOpeningKey) return;
    setIsOpeningKey(true);
    
    const win = window as any;
    const aiStudio = win.aistudio || win.parent?.aistudio;

    if (aiStudio?.openSelectKey) {
      try {
        await aiStudio.openSelectKey();
        setStatus('online');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '✅ Sinal sintonizado no Studio! O que queres ouvir?' 
        }]);
      } catch (err) {
        console.error("Falha ao abrir seletor:", err);
      } finally {
        setIsOpeningKey(false);
      }
    } else {
      // No site oficial, apenas tentamos "limpar" o estado de erro
      setStatus('online');
      setIsOpeningKey(false);
      if (messages[messages.length - 1].text.includes('sintonizar')) {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ A tentar restabelecer ligação ao estúdio central...' 
        }]);
      }
    }
  };

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
      
      if (err.message === "AUTH_ERROR") {
        setStatus('waiting');
        if (!isStudio) {
          setMessages(prev => [...prev, { 
            role: 'model', 
            text: '⚠️ Erro de Ligação: A chave de API não está configurada corretamente no servidor da Rádio. Por favor, contacte o administrador.' 
          }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ O sinal falhou momentaneamente. Tenta de novo!' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/95 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(59,130,246,0.15)] h-[560px] backdrop-blur-xl relative z-40 pointer-events-auto">
      
      {/* Header */}
      <div className="p-5 bg-gray-900/80 border-b border-white/5 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI</span>
        </div>
        
        {isStudio && (
          <button 
            onClick={(e) => { e.preventDefault(); handleSintonizar(); }}
            className={`${isOpeningKey ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'} text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-400/30 transition-all active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer pointer-events-auto`}
          >
            {isOpeningKey ? 'A abrir...' : 'Sintonizar'}
          </button>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide relative z-10">
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
        
        {isTyping && !streamingText && (
          <div className="flex space-x-1.5 p-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Overlay de Bloqueio - Só aparece se estivermos no Studio ou se for erro real */}
      {status === 'waiting' && (
        <div className="absolute inset-0 bg-gray-950/90 z-[100] flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse border border-blue-500/30">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
           </div>
           <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">
             {isStudio ? 'Sinal Codificado' : 'Erro de Ligação'}
           </h4>
           <p className="text-gray-400 text-xs mb-8 max-w-[200px]">
             {isStudio 
               ? 'Clica no botão abaixo para sintonizar a Figueiró AI com o Google.' 
               : 'A chave de API não responde. Tente novamente ou contacte o suporte.'}
           </p>
           
           <button 
              onClick={(e) => { e.preventDefault(); handleSintonizar(); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_40px_rgba(37,99,235,0.4)] border-2 border-blue-400/50 transition-all active:scale-95 cursor-pointer pointer-events-auto"
           >
              {isOpeningKey ? 'A SINTONIZAR...' : (isStudio ? 'SINTONIZAR SINAL AGORA' : 'TENTAR RECONECTAR')}
           </button>
           
           {isStudio && (
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="mt-8 text-[9px] text-gray-500 hover:text-blue-400 underline uppercase tracking-tighter">Documentação de Faturação Google</a>
           )}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-gray-900/90 border-t border-white/5 relative z-50">
        <form 
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) handleSend(input); }} 
          className="flex gap-2"
        >
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={status === 'waiting' || isOpeningKey}
            placeholder={status === 'online' ? "Diz algo ao estúdio..." : "Sintoniza primeiro..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-30 cursor-text pointer-events-auto"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping || status === 'waiting'}
            className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
