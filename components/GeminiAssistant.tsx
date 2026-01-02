
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ 
    role: 'model', 
    text: '🎙️ Estúdio da Figueiró AI pronto! Para começarmos a falar, preciso que sintonize o sinal de dados do Google.' 
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<'online' | 'waiting'>('waiting');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Verificação de chave robusta
  useEffect(() => {
    const checkStatus = async () => {
      // Se houver uma API_KEY no ambiente (Vercel), tentamos usar logo
      if (process.env.API_KEY && process.env.API_KEY.length > 10) {
        setStatus('online');
        return;
      }

      // Caso contrário, verificamos se o browser já tem uma chave selecionada
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (hasKey) setStatus('online');
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSintonizar = async () => {
    try {
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        // Regra de ouro: assumir sucesso após abrir o diálogo
        setStatus('online');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ SINAL RECUPERADO! Já estou no ar. Como posso ajudar a tua rádio hoje?' 
        }]);
      } else {
        // Fallback se o aistudio não estiver injetado (ex: preview local)
        setStatus('online'); 
      }
    } catch (err) {
      console.error("Erro ao sintonizar:", err);
      setStatus('online'); // Forçamos para tentar usar a chave de ambiente
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
    } catch (err: any) {
      setIsTyping(false);
      setStreamingText('');
      if (err.message === "AUTH_ERROR") {
        setStatus('waiting');
      }
      setMessages(prev => [...prev, { role: 'model', text: '🎙️ Tivemos uma pequena interferência. Podes repetir?' }]);
    }
  };

  return (
    <div className="bg-gray-950/90 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.1)] h-[540px] backdrop-blur-2xl relative">
      
      {/* Header Fixo */}
      <div className="p-5 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 flex items-center justify-between border-b border-white/5 z-20">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${status === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`}></div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Figueiró AI</h4>
        </div>
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
          {status === 'online' ? 'Em Direto' : 'Sinal Offline'}
        </span>
      </div>

      {/* Área de Chat / Bloqueio */}
      <div className="flex-grow overflow-y-auto p-6 space-y-5 relative scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[13px] leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800/80 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-tl-none bg-gray-800/80 text-blue-300 text-[13px] border border-blue-500/20 italic">
              {streamingText}
            </div>
          </div>
        )}

        {/* Overlay de Sintonização (Aparece se waiting) */}
        {status === 'waiting' && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-30">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 animate-pulse">
              <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            <h5 className="text-white font-bold text-lg mb-2">Ligar ao Estúdio</h5>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed">O sinal da inteligência artificial precisa de ser sintonizado manualmente para este navegador.</p>
            <button 
              onClick={handleSintonizar}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-blue-600/40"
            >
              Sintonizar Sinal Agora
            </button>
            <p className="mt-6 text-[9px] text-gray-500 uppercase tracking-tighter">Conexão segura via Google AI Studio</p>
          </div>
        )}
        
        <div ref={scrollRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-5 bg-gray-950/50 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-3">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={status === 'waiting' || isTyping}
            placeholder={status === 'waiting' ? "Sintonize primeiro..." : "Diz algo à rádio..."}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping || status === 'waiting'}
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 disabled:opacity-10 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
