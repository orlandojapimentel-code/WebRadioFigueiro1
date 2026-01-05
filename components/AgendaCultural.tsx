
import React from 'react';

interface Event {
  title: string;
  category: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  venue: string;
  organizer: string;
  image: string;
}

const AgendaCultural: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const events: Event[] = [
    {
      title: "Rui Massena – “Parents’ House – Piano Solo”",
      category: "Concertos",
      day: "10",
      month: "JAN",
      date: "SÁB, 10 JAN 2026",
      time: "21:30",
      location: "Amarante",
      venue: "Cine-teatro de Amarante",
      organizer: "Município de Amarante",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "XX Encontro de Cantadores de Janeiras",
      category: "Encontros + Tradição",
      day: "25",
      month: "JAN",
      date: "DOM, 25 JAN 2026",
      time: "15:00",
      location: "Amarante",
      venue: "Amarante (cidade)",
      organizer: "Município de Amarante",
      image: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "LUCA ARGEL – “o homem triste”",
      category: "Concertos",
      day: "31",
      month: "JAN",
      date: "SÁB, 31 JAN 2026",
      time: "21:30",
      location: "Amarante",
      venue: "Cine-teatro de Amarante",
      organizer: "Município de Amarante",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "“Baião d’Oxigénio” no Amarante Cine-Teatro",
      category: "Teatro",
      day: "13",
      month: "MAR",
      date: "SEX, 13 MAR 2026",
      time: "21:30",
      location: "Amarante",
      venue: "Cine-teatro de Amarante",
      organizer: "Município de Amarante",
      image: "https://images.unsplash.com/photo-1503095396549-807a8bc3667c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#f4f4f4] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Estilo Viral Agenda */}
      <div className="sticky top-0 z-10 bg-[#007a4d] text-white shadow-lg">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-light">Agenda</span>
                <span className="text-sm opacity-60">de</span>
                <span className="text-2xl font-bold border-b-2 border-white/30">Amarante</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-full transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Imagem com Badge de Data */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-4 bg-[#007a4d] text-white px-3 py-2 text-center rounded-b-lg shadow-lg">
                  <p className="text-[10px] font-bold uppercase leading-none">{event.month}</p>
                  <p className="text-xl font-black leading-none mt-1">{event.day}</p>
                </div>
                <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 bg-white/90 rounded-full text-[#007a4d] shadow-sm hover:bg-white">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                   </button>
                </div>
              </div>

              {/* Conteúdo Detalhado */}
              <div className="p-5 space-y-4">
                <h3 className="text-[#007a4d] font-bold text-lg leading-snug min-h-[3.5rem] group-hover:underline cursor-pointer">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>{event.time} <span className="mx-1">•</span> {event.location}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span className="leading-tight">{event.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    <span className="truncate">{event.organizer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    <span className="font-semibold">{event.category}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                   <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                   </div>
                   <button className="text-[10px] font-black uppercase tracking-widest text-[#007a4d] hover:text-green-700 transition-colors">
                     Ver Detalhes
                   </button>
                </div>
              </div>
            </div>
          ))}

          {/* Card de Evento Vazio (A decorrer) como na imagem */}
          <div className="bg-white/50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-gray-400 space-y-4">
             <div className="relative">
               <svg className="w-12 h-12 text-[#007a4d]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               <span className="absolute -top-1 -right-1 flex h-4 w-4">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
                 <span className="relative inline-flex rounded-full h-4 w-4 bg-[#007a4d]/40 flex items-center justify-center text-[8px] text-white font-bold">!</span>
               </span>
             </div>
             <div className="text-center">
               <p className="text-xs font-bold uppercase tracking-widest">A decorrer</p>
               <p className="text-[10px] mt-1 italic">Mais eventos em breve...</p>
             </div>
          </div>
        </div>

        <div className="mt-12 py-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
            Fonte: Viral Agenda Amarante & Município de Amarante
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgendaCultural;
