
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio ligado em Figueiró! Já estou sintonizada e pronta para as vossas mensagens. Como vos posso ajudar?' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting' | 'error'>('online');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Verifica se já existe uma chave selecionada no ambiente
  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey && !process.env.API_KEY) {
          setStatus('waiting');
        }
      }
    };
    checkKey();
  }, []);

  const handleSintonizar = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Após abrir o diálogo, assumimos que o utilizador vai selecionar a chave
      setStatus('online');
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: '🎙️ Sinal sintonizado com sucesso! Pode enviar a sua mensagem agora.' 
      }]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const result = await getRadioAssistantStream(text, (chunk) => {
        setStreamingText(chunk);
      });
      setMessages(prev => [...prev, { role: 'model', text: result }]);
      setStreamingText('');
      setIsTyping(false);
      setStatus('online');
    } catch (err: any) {
      console.error("Erro na Figueiró AI:", err);
      setIsTyping(false);
      setStreamingText('');
      
      if (err.message === "AUTH_ERROR") {
        setStatus('waiting');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ O sinal da IA está enfraquecido. Por favor, clique em "SINTONIZAR" para restabelecer a ligação com o estúdio.' 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: '🎙️ Estamos com algumas interferências. Tente novamente!' }]);
      }
    }
  };

  return (
    <div className="bg-gray-950/90 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.1)] h-[540px] backdrop-blur-2xl transition-all duration-700">
      {/* Topo do Chat */}
      <div className="p-5 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
              status === 'online' ? 'bg-blue-500/20 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
              status === 'waiting' ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-red-500/20 border-red-400/30'
            }`}>
              <svg className={`w-5 h-5 ${status === 'online' ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 border-2 border-gray-950 rounded-full transition-colors duration-500 ${
              status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
              status === 'waiting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></span>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] leading-none">Figueiró AI</h4>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${
              status === 'online' ? 'text-blue-400' : 'text-gray-500'
            }`}>
              {status === 'online' ? 'No Ar em Direto' : status === 'waiting' ? 'Sinal em Espera' : 'Erro de Sinal'}
            </span>
          </div>
        </div>
        
        {status === 'waiting' ? (
          <button 
            onClick={handleSintonizar}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all animate-bounce shadow-lg shadow-yellow-500/20"
          >
            Sintonizar
          </button>
        ) : (
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-blue-500 rounded-full animate-[wave_1s_infinite]"></div>
            <div className="w-1 h-3 bg-blue-400 rounded-full animate-[wave_1s_0.2s_infinite]"></div>
            <div className="w-1 h-3 bg-blue-300 rounded-full animate-[wave_1s_0.4s_infinite]"></div>
          </div>
        )}
      </div>

      {/* Área de Mensagens */}
      <div className="flex-grow overflow-y-auto p-6 space-y-5 scrollbar-hide bg-gradient-to-b from-transparent to-blue-600/5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-600/20' 
                : 'bg-gray-800/80 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-5 py-3.5 rounded-2xl rounded-tl-none bg-gray-800/80 text-blue-300 text-[13px] border border-blue-500/20 italic">
              {streamingText}<span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse align-middle"></span>
            </div>
          </div>
        )}
        {isTyping && !streamingText && (
          <div className="flex items-center space-x-2 p-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-5 bg-gray-950/50 border-t border-white/5 backdrop-blur-md">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-3">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder={status === 'waiting' ? "Clique em Sintonizar para falar..." : "Manda um olá à Figueiró AI..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 transition-all focus:bg-white/10"
          />
          <button 
            type="submit" disabled={!input.trim() || isTyping || status === 'waiting'} 
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all active:scale-95 shadow-xl shadow-blue-600/30 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  );
};

export default GeminiAssistant;
