
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const mensagemInicial: ChatMessage = { 
    role: 'model', 
    text: 'Sintonizados! Sou o Figueiró AI. 🎙️ Como posso animar o seu dia?' 
  };

  const [messages, setMessages] = useState<ChatMessage[]>([mensagemInicial]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const enviarMensagem = async (texto: string) => {
    if (!texto.trim() || isTyping) return;

    const novaMsg: ChatMessage = { role: 'user', text: texto };
    setMessages(prev => [...prev, novaMsg]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const respostaFinal = await getRadioAssistantStream(texto, (chunk) => {
        setStreamingText(chunk);
      });
      
      setMessages(prev => [...prev, { role: 'model', text: respostaFinal }]);
      setStreamingText('');
      setIsTyping(false);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Sinal fraco no estúdio! 🎙️ Mas a música continua, tente novamente daqui a pouco." 
      }]);
      setStreamingText('');
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-[2.5rem] border border-blue-500/30 overflow-hidden flex flex-col shadow-2xl h-[480px] transition-all hover:border-blue-500/60">
      {/* Topo do Chat - Estilo Mesa de Mistura */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 ${isTyping ? 'animate-pulse' : ''}`}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${isTyping ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest">Figueiró AI</h4>
            <p className="text-[9px] text-blue-200 font-bold uppercase tracking-tighter">Estúdio em Direto</p>
          </div>
        </div>
        <button onClick={() => setMessages([mensagemInicial])} title="Limpar Conversa" className="p-2 text-white/40 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      {/* Janela de Conversa */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-gray-900/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-md ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {/* Texto em tempo real */}
        {streamingText && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-gray-800 text-blue-100 text-[13px] border border-blue-500/20 shadow-lg">
              {streamingText}
              <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse rounded-full align-middle"></span>
            </div>
          </div>
        )}

        {isTyping && !streamingText && (
          <div className="flex items-center space-x-2 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Zona de Envio */}
      <div className="p-4 bg-gray-950 border-t border-white/5 space-y-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
          {["🎙️ Dedicatória", "🎵 Sugestão", "🚗 Rent a Car"].map((tag) => (
            <button 
              key={tag} 
              onClick={() => enviarMensagem(`Quero uma ${tag.split(' ')[1]}`)}
              className="bg-white/5 hover:bg-blue-600/30 border border-white/10 rounded-full px-3 py-1 text-[10px] text-blue-400 font-bold transition-all whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); enviarMensagem(input); }} 
          className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-3 py-1 focus-within:border-blue-500/50 transition-all"
        >
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            disabled={isTyping}
            placeholder="Mensagem para o estúdio..."
            className="flex-grow bg-transparent border-none py-3 text-xs text-white focus:ring-0 placeholder:text-gray-600"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()} 
            className="p-2 text-blue-500 hover:text-blue-400 disabled:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
