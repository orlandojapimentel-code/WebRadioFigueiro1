
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

  // EVENTOS DE FALLBACK (Sempre mostrados se a API falhar)
  const fallbackEvents: Event[] = [
    {
      title: "Festas de S. Gonçalo 2025",
      dateStr: "Junho",
      day: "07",
      month: "JUN",
      location: "Centro Histórico de Amarante",
      category: "FESTA",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
      sourceUrl: "https://www.cm-amarante.pt/"
    },
    {
      title: "Mimo Festival Amarante",
      dateStr: "Julho",
      day: "19",
      month: "JUL",
      location: "Parque Ribeirinho",
      category: "CONCERTO",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
      sourceUrl: "https://mimofestival.com/"
    },
    {
      title: "Há Verão em Amarante",
      dateStr: "Agosto",
      day: "15",
      month: "AGO",
      location: "Vários Locais",
      category: "EVENTO",
      image: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800",
      sourceUrl: "https://www.cm-amarante.pt/"
    }
  ];

  const categoryImages: Record<string, string> = {
    "CONCERTO": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
    "EXPOSIÇÃO": "https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=800",
    "TEATRO": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800",
    "FESTA": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
    "CINEMA": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
    "GERAL": "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800"
  };

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      
      try {
        const result = await fetchCulturalEvents();
        
        if (result && result.text) {
          const eventBlocks = result.text.match(/EVENTO_START[\s\S]*?EVENTO_END/g);
          
          if (eventBlocks && eventBlocks.length > 0) {
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
                title: title || "Evento Cultural",
                dateStr,
                day,
                month: month || "AGENDA",
                location: local || "Amarante",
                category: type,
                image: (img && img.startsWith('http')) ? img : (categoryImages[type] || categoryImages["GERAL"]),
                sourceUrl: link || "https://www.viralagenda.com/pt/p/municipiodeamarante"
              };
            });
            setEvents(parsed);
            setLoading(false);
            return;
          }
        }
        
        // Se chegar aqui, falhou a API ou o Parse -> Usa Fallback
        setEvents(fallbackEvents);
      } catch (err) {
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8fafc] overflow-y-auto animate-in fade-in duration-700">
      {/* Header Profissional - Estilo Magazine */}
      <div className="sticky top-0 z-30 bg-[#1e1b4b] text-white shadow-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-amber-500 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-amber-500/40 transform -rotate-3">
              <svg className="w-8 h-8 text-[#1e1b4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter leading-none">Cultura & Agenda</h2>
              <div className="flex items-center mt-1.5 space-x-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-amber-400/80 font-black uppercase tracking-[0.3em]">Exclusivo Web Rádio Figueiró</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center space-x-3 px-6 py-3 bg-white/5 hover:bg-red-500 text-white rounded-2xl border border-white/10 transition-all duration-300"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Fechar Agenda</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-10">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-[6px] border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-indigo-900 font-black text-lg uppercase tracking-[0.4em]">Sintonizando Agenda Cultural</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Consultando Viral Agenda em Amarante</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {events.map((event, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
              >
                {/* Imagem com Overlay de Gradiente */}
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = categoryImages[event.category] || categoryImages["GERAL"];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Badge de Data Flutuante */}
                  <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl p-4 text-center min-w-[80px] border border-white/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                    <p className="text-[11px] font-black uppercase tracking-tighter opacity-60 leading-none">{event.month}</p>
                    <p className="text-4xl font-black leading-none mt-2">{event.day}</p>
                  </div>

                  {/* Categoria com Blurring */}
                  <div className="absolute bottom-8 left-8">
                    <span className="px-5 py-2.5 bg-indigo-600/90 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl border border-white/10">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Info */}
                <div className="p-12 flex flex-col flex-grow bg-white">
                  <h3 className="text-[#1e1b4b] font-black text-3xl leading-[1.1] mb-8 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-5 mb-10">
                    <div className="flex items-center space-x-4 text-slate-500">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wide text-slate-600 truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-10 border-t border-slate-50 flex items-center gap-5">
                    <a 
                      href={event.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow bg-[#1e1b4b] hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] text-center shadow-xl shadow-indigo-900/10 transition-all active:scale-95"
                    >
                      Descobrir Mais
                    </a>
                    <button className="p-5 bg-slate-50 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-[1.5rem] transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-32 text-center py-20 border-t border-slate-200">
          <div className="inline-block px-8 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm mb-8">
             <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.6em]">
               Web Rádio Figueiró • Cultura Amarante {new Date().getFullYear()}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaCultural;
