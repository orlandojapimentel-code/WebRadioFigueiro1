
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

  // Galeria de imagens profissionais caso o cartaz real não seja encontrado
  const fallbackImages: Record<string, string> = {
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
      const result = await fetchCulturalEvents();
      
      if (result && result.text) {
        const eventBlocks = result.text.split('EVENTO_START');
        
        const parsedEvents: Event[] = eventBlocks
          .filter(b => b.includes('EVENTO_END'))
          .map((block) => {
            const getValue = (key: string) => {
              const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
              const match = block.match(regex);
              return match ? match[1].trim() : "";
            };

            const title = getValue('TITULO');
            const dateStr = getValue('DATA');
            const local = getValue('LOCAL');
            const type = getValue('TIPO').toUpperCase() || "GERAL";
            const img = getValue('IMAGEM');
            const link = getValue('LINK');

            const dayMatch = dateStr.match(/\d+/);
            const day = dayMatch ? dayMatch[0] : "??";
            const month = dateStr.replace(day, "").replace(/de/g, "").trim().substring(0, 3).toUpperCase();

            // Lógica de imagem: Real -> Categoria -> Geral
            const finalImage = (img && img.startsWith('http')) 
              ? img 
              : (fallbackImages[type] || fallbackImages["GERAL"]);

            return {
              title,
              dateStr,
              day,
              month: month || "EVENTO",
              location: local,
              category: type,
              image: finalImage,
              sourceUrl: link || "https://www.viralagenda.com/pt/p/municipiodeamarante"
            };
          });

        if (parsedEvents.length > 0) setEvents(parsedEvents);
      }
      setLoading(false);
    };
    loadEvents();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in duration-500">
      {/* Header Premium - Indigo Profundo */}
      <div className="sticky top-0 z-30 bg-[#1e1b4b] text-white shadow-2xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-6 h-6 text-[#1e1b4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter leading-none">Agenda Cultural</h2>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-1">Sintonizada em Amarante</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-indigo-900 font-black text-sm uppercase tracking-[0.3em] animate-pulse">A procurar Cartazes Reais...</p>
              <p className="text-slate-400 text-[10px] mt-2 font-bold">FONTE: VIRAL AGENDA AMARANTE</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative h-80 overflow-hidden bg-slate-100">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Badge de Data Customizado */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center min-w-[70px] border border-slate-100 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                    <p className="text-[10px] font-black uppercase tracking-tighter opacity-60 leading-none">{event.month}</p>
                    <p className="text-3xl font-black leading-none mt-1.5">{event.day}</p>
                  </div>

                  <div className="absolute bottom-6 left-6">
                    <span className="px-4 py-2 bg-indigo-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-[#1e1b4b] font-black text-2xl leading-tight mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center space-x-3 text-slate-400 mb-8">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide">{event.location}</span>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center gap-4">
                    <a 
                      href={event.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow bg-[#1e1b4b] hover:bg-indigo-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-center shadow-lg transition-all active:scale-95"
                    >
                      Ver Detalhes
                    </a>
                    <button className="p-4 bg-slate-50 text-slate-300 hover:text-amber-500 rounded-2xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center py-16 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">
            Web Rádio Figueiró • Cultura Amarante {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgendaCultural;
