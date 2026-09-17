
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
    } catch (err) {
      console.warn("Notice loading cultural events:", err);
      setErrorType('empty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleCloseOverlays = () => onClose();
    window.addEventListener('close-overlays', handleCloseOverlays);
    
    loadEvents();

    // Adicionar estado ao histórico para permitir retroceder
    window.history.pushState({ modal: 'agenda' }, '');
    
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('close-overlays', handleCloseOverlays);
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    // Se o modal estiver aberto, retroceder no histórico se o estado for do modal
    if (window.history.state?.modal === 'agenda') {
      window.history.back();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#07090e]/95 backdrop-blur-3xl overflow-y-auto animate-in fade-in duration-300 text-white">
      {/* Header Premium */}
      <div className="sticky top-0 z-30 bg-[#07090e]/85 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-[9px] text-orange-400 font-black uppercase tracking-[0.25em] block">
                Exclusivo Web Rádio Figueiró
              </span>
              <h2 className="text-lg sm:text-2xl font-brand font-black tracking-tight text-white leading-none mt-0.5">
                Agenda Cultural & Eventos
              </h2>
            </div>
          </div>
          
          <button 
            onClick={handleClose}
            className="flex items-center space-x-2 px-4 sm:px-5 py-2.5 bg-white/5 hover:bg-red-600 text-white rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-wider"
          >
            <span className="hidden sm:inline">Fechar Agenda</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-36">
             <div className="relative w-16 h-16">
               <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <p className="mt-8 text-orange-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
               Sintonizando eventos culturais...
             </p>
          </div>
        ) : errorType !== 'none' ? (
          <div className="flex flex-col items-center justify-center py-28 text-center max-w-lg mx-auto glass-card p-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-400 border border-white/10">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-brand font-black text-white mb-2">Sinal Cultural Indisponível</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-8">
              A consultar os próximos eventos em Amarante. Pode tentar recarregar para consultar a emissão da agenda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button 
                onClick={loadEvents}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 active:scale-95"
              >
                Recarregar Agenda
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event, index) => (
              <div 
                key={index} 
                className="glass-card glass-card-interactive overflow-hidden flex flex-col group transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={event.title}
                    onError={(e) => e.currentTarget.src = fallbackImages[event.category] || fallbackImages["GERAL"]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-80" />
                  
                  {/* Badge de Data */}
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md rounded-2xl p-2.5 text-center min-w-[64px] border border-white/15 shadow-xl">
                    <p className="text-[9px] font-black text-orange-400 uppercase leading-none mb-1 tracking-wider">{event.month}</p>
                    <p className="text-2xl font-brand font-black leading-none text-white">{event.day}</p>
                  </div>

                  {/* Categoria */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-orange-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-md border border-orange-400/30">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-white font-brand font-black text-lg sm:text-xl leading-snug mb-3 line-clamp-2 min-h-[3rem] group-hover:text-orange-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2.5 text-slate-300 mb-6">
                    <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-orange-400 shrink-0 border border-white/5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-semibold truncate">{event.location}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-center space-x-3">
                    <a 
                      href={event.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center shadow-md shadow-orange-600/20 transition-all active:scale-95"
                    >
                      Ver Detalhes
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center py-8 border-t border-white/[0.08]">
           <div className="inline-block px-6 py-2 bg-white/5 rounded-full border border-white/10">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
               Web Rádio Figueiró • Agenda Cultural de Amarante
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaCultural;
