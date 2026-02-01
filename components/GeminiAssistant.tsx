
import React, { useState, useRef, useEffect } from 'react';
import { getRadioAssistantResponse } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'pedido'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Olá! Sou a assistente da Web Rádio Figueiró. Queres sugestões de música ou saber algo sobre Amarante?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getRadioAssistantResponse(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpa, tive uma pequena falha na sintonização. Podes repetir?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = "351910270085";
    const text = encodeURIComponent("Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl overflow-hidden flex flex-col transition-all h-[550px]">
      {/* Header com Tabs */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1">
        <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-t-[2.3rem]">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-white text-blue-600 shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Conversar com IA
          </button>
          <button 
            onClick={() => setActiveTab('pedido')}
            className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pedido' ? 'bg-white text-blue-600 shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Fazer Pedido
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* INTERFACE DE CHAT IA */
        <div className="flex flex-col h-full bg-slate-50 dark:bg-transparent overflow-hidden">
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                    : 'bg-white dark:bg-white/5 text-slate-800 dark:text-gray-200 border-gray-100 dark:border-white/10 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pergunta-me algo..."
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-blue-500/50 rounded-2xl py-3.5 pl-5 pr-14 text-xs outline-none transition-all dark:text-white"
              />
              <button 
                type="submit"
                className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* INTERFACE DE PEDIDO TRADICIONAL */
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          <div className="text-center space-y-2">
            <p className="text-slate-500 dark:text-gray-400 text-xs font-medium">A nossa equipa está pronta para ouvir o seu pedido e enviar uma dedicatória especial.</p>
          </div>

          <button 
            onClick={handleWhatsApp} 
            className="w-full group flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-green-600/20 active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Dedicatória via WhatsApp</span>
          </button>

          <form className="cc_request_form space-y-3" data-username="orlando">
             <input type="text" name="request[artist]" className="w-full bg-slate-100 dark:bg-black/40 border border-transparent rounded-xl px-5 py-3 text-xs dark:text-white" placeholder="Artista" />
             <input type="text" name="request[title]" className="w-full bg-slate-100 dark:bg-black/40 border border-transparent rounded-xl px-5 py-3 text-xs dark:text-white" placeholder="Música" />
             <input type="text" name="request[dedication]" className="w-full bg-slate-100 dark:bg-black/40 border border-transparent rounded-xl px-5 py-3 text-xs dark:text-white" placeholder="Dedicatória para..." />
             <input type="text" name="request[sender]" className="w-full bg-slate-100 dark:bg-black/40 border border-transparent rounded-xl px-5 py-3 text-xs dark:text-white" placeholder="Seu Nome" />
             <div data-type="result" className="text-[10px] font-bold text-center py-1 text-blue-600 empty:hidden"></div>
             <button type="button" data-type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all">
               Submeter Pedido
             </button>
          </form>
        </div>
      )}

      <div className="p-4 bg-gray-50 dark:bg-black/20 text-center border-t border-gray-100 dark:border-white/5 shrink-0">
        <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.4em]">Web Rádio Figueiró • 2026</p>
      </div>
    </div>
  );
};

export default GeminiAssistant;
