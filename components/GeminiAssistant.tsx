
import React, { useState, useEffect, useRef } from 'react';
import { getRadioAssistantStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem('wrf_chat_v2.4');
    return saved ? JSON.parse(saved) : [{ 
      role: 'model', 
      text: '🎙️ Olá! Sou a Figueiró AI. Estás pronto para pedir a tua música? ✨' 
    }];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'tuning' | 'error'>('online');
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('wrf_chat_v2.4', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isTyping, connectionStatus]);

  const handleSintonizar = async () => {
    try {
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setConnectionStatus('online');
        if (lastFailedMessage) {
          handleSend(lastFailedMessage, true);
          setLastFailedMessage(null);
        }
      } else {
        // Se não estamos no estúdio, tentamos apenas resetar o estado
        setConnectionStatus('online');
      }
    } catch (err) {
      console.error("Erro ao sintonizar:", err);
    }
  };

  const handleSend = async (text: string, isRetry = false) => {
    if (!text.trim() || isTyping) return;

    const userMsg = text.trim();
    if (!isRetry) {
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    }
    
    setInput('');
    setIsTyping(true);
    setStreamingText('');
    setConnectionStatus('online');

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
      
      if (err.message === "MISSING_KEY" || err.message === "INVALID_KEY") {
        setLastFailedMessage(userMsg);
        // Só entramos em modo tuning se o seletor estiver disponível, caso contrário é um erro de servidor
        // @ts-ignore
        if (window.aistudio) {
          setConnectionStatus('tuning');
        } else {
          setConnectionStatus('error');
          setMessages(prev => [...prev, { 
            role: 'model', 
            text: '📡 Estamos com dificuldades técnicas no nosso satélite AI. Por favor, usa o botão de WhatsApp abaixo para o teu pedido direto! 🎙️' 
          }]);
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: '🎙️ Muita estática no ar... Podes repetir o pedido?' 
        }]);
      }
    }
  };

  const sendToWhatsApp = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const msg = lastUserMsg ? lastUserMsg.text : "Olá! Gostaria de pedir uma música.";
    const phoneNumber = "351910270085";
    const encodedText = encodeURIComponent(`📻 *Pedido via Web Rádio Figueiró*:\n\n"${msg}"`);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-gray-950/95 rounded-[2.5rem] border border-indigo-500/30 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(79,70,229,0.15)] h-[580px] backdrop-blur-xl relative z-[60]">
      
      <div className="p-5 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-green-500 animate-pulse' : connectionStatus === 'tuning' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Figueiró AI v2.5</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[8px] font-black uppercase tracking-widest">
          {connectionStatus === 'online' ? 'Em Direto' : 'Manutenção'}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-hide bg-black/20 relative">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-gray-800/95 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-indigo-900/30 text-indigo-200 text-[13px] border border-indigo-500/20">
              {streamingText}
            </div>
          </div>
        )}

        {connectionStatus === 'tuning' && (
          <div className="absolute inset-x-0 bottom-4 px-4 z-20">
            <div className="bg-indigo-950/95 backdrop-blur-2xl border border-indigo-400/50 p-6 rounded-[2.5rem] shadow-2xl text-center">
              <p className="text-white font-black text-sm mb-1 uppercase tracking-wider">Sinal AI em Baixa</p>
              <button 
                onClick={handleSintonizar}
                className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95"
              >
                Recuperar Sinal AI
              </button>
            </div>
          </div>
        )}

        {messages.some(m => m.role === 'user') && !isTyping && !streamingText && (
          <div className="flex justify-center pt-4 pb-2 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={sendToWhatsApp}
              className="flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border border-green-400 shadow-[0_10px_30px_rgba(22,163,74,0.3)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>Enviar para o Estúdio</span>
            </button>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-gray-900/95 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) handleSend(input); }} className="flex gap-2">
          <input 
            type="text" value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={connectionStatus === 'error'}
            placeholder={connectionStatus === 'online' ? "Pede a tua música aqui..." : "Serviço temporariamente indisponível"}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping || connectionStatus === 'error'}
            className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg"
          >
            {isTyping ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3"/></svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;
