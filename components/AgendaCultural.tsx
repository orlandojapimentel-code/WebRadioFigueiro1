
import React, { useState, useEffect } from 'react';
import { fetchCulturalEvents } from '../services/geminiService';

interface Event {
  title: string;
  dateStr: string;
  day: string;
  month: string;
  location: string;
  category: string;
  image: string;
  sourceUrl: string;
}

const AgendaCultural: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<'none' | 'key' | 'empty'>('none');

  const fallbackImages: Record<string, string> = {
    "CONCERTO": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
    "EXPOSIÇÃO": "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800",
    "TEATRO": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800",
    "FESTA": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
    "GERAL": "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
  };

  const handleSintonizar = async () => {
    // Tenta usar o seletor do AI Studio se disponível, senão avisa que precisa de chave
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      loadEvents();
    } else {
      // Na web pública, isto abre o diálogo padrão se injetado, ou podemos redirecionar
      alert("Para sintonizar a agenda no site público, a chave de API deve ser configurada no painel de administração.");
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    setErrorType('none');
    
    try {
      const result = await fetchCulturalEvents();
      
      if (!result || !result.text || !result.text.includes("EVENTO_START")) {
        setErrorType('empty');
        setLoading(false);
        return;
      }

      const eventBlocks = result.text.match(/EVENTO_START[\s\S]*?EVENTO_END/g);
      
      if (!eventBlocks || eventBlocks.length === 0) {
        setErrorType('empty');
        setLoading(false);
        return;
      }

      const parsed = eventBlocks.map((block) => {
        const extract = (key: string) => {
          const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
          const match = block.match(regex);
          return match ? match[1].trim().replace(/[*`]/g, '') : "";
        };

        const title = extract('TITULO');
        const dateStr = extract('DATA');
        const local = extract('LOCAL');
        const type = extract('TIPO').toUpperCase() || "GERAL";
        const img = extract('IMAGEM');
        const link = extract('LINK');

        const dayMatch = dateStr.match(/\d+/);
        const day = dayMatch ? dayMatch[0] : "??";
        const monthPart = dateStr.replace(day, "").replace(/de/g, "").trim().substring(0, 3).toUpperCase();

        return {
          title: title || "Evento Cultural",
          dateStr,
          day,
          month: monthPart || "AGENDA",
          location: local || "Amarante",
          category: type,
          image: (img && img.startsWith('http')) ? img : (fallbackImages[type] || fallbackImages["GERAL"]),
          sourceUrl: link || "https://www.viralagenda.com/pt/p/municipiodeamarante"
        };
      });

      setEvents(parsed);
    } catch (err: any) {
      console.error(err);
      if (err.message === "MISSING_KEY") {
        setErrorType('key');
      } else {
        setErrorType('empty');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#fcfcfd] overflow-y-auto animate-in fade-in duration-700">
      {/* Header Premium */}
      <div className="sticky top-0 z-30 bg-[#1e1b4b] text-white shadow-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
              <svg className="w-7 h-7 text-[#1e1b4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">Cultura & Agenda</h2>
              <p className="text-[9px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-1.5">● EXCLUSIVO WEB RÁDIO FIGUEIRÓ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-red-500/20 rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <span>Fechar Agenda</span>
            <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48">
             <div className="relative w-20 h-20">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <p className="mt-10 text-indigo-900 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Sintonizando Amarante...</p>
          </div>
        ) : errorType !== 'none' ? (
          <div className="flex flex-col items-center justify-center py-40 text-center max-w-xl mx-auto">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-8 text-slate-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Sinal Cultural Indisponível</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 px-8">
              {errorType === 'key' 
                ? "A sintonização da IA requer uma autorização. No site publicado, certifique-se que a chave de API está ativa." 
                : "Não conseguimos captar eventos para as próximas datas. Tente sintonizar novamente ou regresse mais tarde."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={loadEvents}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
              >
                Tentar Recarregar
              </button>
              <button 
                onClick={handleSintonizar}
                className="px-10 py-4 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all"
              >
                Sintonizar IA
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={event.image} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={event.title}
                    onError={(e) => e.currentTarget.src = fallbackImages[event.category] || fallbackImages["GERAL"]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Badge de Data - Topo Esquerdo (Padrão Studio) */}
                  <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl rounded-[1.5rem] p-4 text-center min-w-[75px] shadow-2xl border border-white/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                    <p className="text-[10px] font-black text-slate-400 group-hover:text-white/80 uppercase leading-none mb-1.5 tracking-tighter">{event.month}</p>
                    <p className="text-4xl font-black leading-none">{event.day}</p>
                  </div>

                  {/* Categoria - Canto Inferior (Padrão Studio) */}
                  <div className="absolute bottom-8 left-8">
                    <span className="px-5 py-2 bg-indigo-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl border border-white/10">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-12 flex flex-col flex-grow bg-white">
                  <h3 className="text-[#1e1b4b] font-black text-2xl leading-tight mb-6 line-clamp-2 min-h-[4rem] group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-slate-500 mb-10">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest truncate">{event.location}</span>
                  </div>

                  <div className="mt-auto flex items-center space-x-4">
                    <a 
                      href={event.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow bg-[#1e1b4b] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Descobrir Mais
                    </a>
                    <button className="p-5 bg-slate-50 text-slate-300 rounded-2xl hover:text-amber-500 hover:bg-amber-50 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-32 text-center py-20 border-t border-slate-100">
           <div className="inline-block px-8 py-3 bg-white rounded-full border border-slate-100 shadow-sm">
             <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.6em]">
               WEB RÁDIO FIGUEIRÓ • CULTURA AMARANTE 2026
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaCultural;
