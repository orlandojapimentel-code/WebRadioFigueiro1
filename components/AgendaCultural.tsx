
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
  const [needsKey, setNeedsKey] = useState(false);

  const fallbackImages: Record<string, string> = {
    "CONCERTO": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
    "EXPOSIÇÃO": "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800",
    "TEATRO": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800",
    "FESTA": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
    "GERAL": "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
  };

  const handleSintonizar = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Após abrir o seletor, tentamos recarregar
      loadEvents();
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    setNeedsKey(false);
    
    try {
      const result = await fetchCulturalEvents();
      
      if (!result || !result.text) {
        // Se falhou e estamos num ambiente com AI Studio, pedimos para sintonizar
        // @ts-ignore
        if (window.aistudio) setNeedsKey(true);
        setLoading(false);
        return;
      }

      const eventBlocks = result.text.match(/EVENTO_START[\s\S]*?EVENTO_END/g);
      
      if (!eventBlocks || eventBlocks.length === 0) {
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
        const month = dateStr.replace(day, "").replace(/de/g, "").trim().substring(0, 3).toUpperCase();

        return {
          title: title || "Evento em Amarante",
          dateStr,
          day,
          month: month || "AGENDA",
          location: local || "Amarante",
          category: type,
          image: (img && img.startsWith('http')) ? img : (fallbackImages[type] || fallbackImages["GERAL"]),
          sourceUrl: link || "https://www.viralagenda.com/pt/p/municipiodeamarante"
        };
      });

      setEvents(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#fcfcfd] overflow-y-auto animate-in fade-in duration-700">
      {/* Header Estilo Dark Indigo */}
      <div className="sticky top-0 z-30 bg-[#1e1b4b] text-white shadow-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
              <svg className="w-7 h-7 text-[#1e1b4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Cultura & Agenda</h2>
              <p className="text-[9px] text-amber-400 font-bold uppercase tracking-[0.2em]">● EXCLUSIVO WEB RÁDIO FIGUEIRÓ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <span>Fechar Agenda</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-8 text-indigo-900 font-black uppercase tracking-widest animate-pulse">Sintonizando Amarante...</p>
          </div>
        ) : needsKey ? (
          <div className="flex flex-col items-center justify-center py-40 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900">Agenda não Sintonizada</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Para carregar os eventos reais de Amarante no site publicado, é necessário autorizar a sintonização da IA.</p>
            <button 
              onClick={handleSintonizar}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all"
            >
              Sintonizar Agora
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-40">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Sem eventos disponíveis de momento.</p>
            <button onClick={loadEvents} className="mt-4 text-indigo-600 font-black text-xs uppercase">Tentar Recarregar</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col group transition-all hover:-translate-y-2">
                <div className="relative h-80">
                  <img 
                    src={event.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={event.title}
                    onError={(e) => e.currentTarget.src = fallbackImages[event.category] || fallbackImages["GERAL"]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Badge de Data no Topo Esquerdo */}
                  <div className="absolute top-6 left-6 bg-white rounded-2xl p-3 text-center min-w-[65px] shadow-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{event.month}</p>
                    <p className="text-3xl font-black text-[#1e1b4b] leading-none">{event.day}</p>
                  </div>

                  {/* Categoria na Base da Imagem */}
                  <div className="absolute bottom-6 left-6">
                    <span className="px-4 py-1.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-[#1e1b4b] font-black text-2xl leading-tight mb-6 line-clamp-2 min-h-[3.5rem]">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center space-x-3 text-slate-400 mb-8">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest truncate">{event.location}</span>
                  </div>

                  <div className="mt-auto flex items-center space-x-3">
                    <a 
                      href={event.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow bg-[#1e1b4b] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center shadow-lg hover:bg-indigo-700 transition-all"
                    >
                      Descobrir Mais
                    </a>
                    <button className="p-4 bg-slate-50 text-slate-300 rounded-xl hover:text-indigo-600 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center py-12 border-t border-slate-100">
           <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em]">
             WEB RÁDIO FIGUEIRÓ - CULTURA AMARANTE 2026
           </p>
        </div>
      </div>
    </div>
  );
};

export default AgendaCultural;
