
import React, { useState, useEffect } from 'react';

interface ProgramSlot {
  time: string;
  start: number;
  end: number;
  name: string;
  host: string;
}

const Schedule: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const dailyPrograms: ProgramSlot[] = [
    { time: "08:00 - 10:00", start: 8, end: 10, name: "Manhãs Figueiró", host: "Música para começar o dia" },
    { time: "10:00 - 13:00", start: 10, end: 13, name: "Top Hits", host: "As mais pedidas do momento" },
    { time: "13:00 - 15:00", start: 13, end: 15, name: "Almoço Musical", host: "Sons tranquilos para o meio do dia" },
    { time: "15:00 - 19:00", start: 15, end: 19, name: "Tardes em Movimento", host: "Energia para o seu regresso" },
    { time: "19:00 - 08:00", start: 19, end: 32, name: "Noite Digital", host: "A melhor seleção musical non-stop" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentProgram = (start: number, end: number) => {
    const hour = currentTime.getHours();
    // Lógica para programas que atravessam a meia-noite (como 19h - 08h)
    if (start > end) {
      return hour >= start || hour < end;
    }
    return hour >= start && hour < end;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Programação</h3>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1">Horário Local: {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Diária */}
        <div className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-8 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden transition-all">
          <h4 className="text-xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight flex items-center">
             <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
             Emissão Diária
          </h4>
          
          <div className="space-y-4">
            {dailyPrograms.map((p, i) => {
              const active = isCurrentProgram(p.start, p.end);
              return (
                <div 
                  key={i} 
                  className={`relative flex justify-between items-center p-5 rounded-[1.5rem] transition-all duration-500 border ${
                    active 
                    ? 'bg-blue-600/5 dark:bg-blue-600/10 border-blue-600/30 scale-[1.02] shadow-lg shadow-blue-600/5' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full"></div>
                  )}
                  
                  <div className="flex-grow pr-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`text-sm font-black tracking-tight ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                        {p.name}
                      </p>
                      {active && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">{p.host}</p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-mono px-3 py-1.5 rounded-xl border transition-colors ${
                      active 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-transparent'
                    }`}>
                      {p.time}
                    </span>
                    {active && (
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-2 animate-pulse">Agora</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Especiais de Fim de Semana */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">Destaque de Domingo</p>
            <h5 className="text-3xl font-black tracking-tighter mb-4">Night Grooves</h5>
            <div className="space-y-3 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-70">Horário:</span>
                <span className="text-xs font-black">22:00 - 00:00</span>
              </div>
              <div className="h-[1px] bg-white/10"></div>
              <p className="text-sm font-medium">1ª Hora: <span className="font-black text-amber-400">DJ Durval</span></p>
              <p className="text-sm font-medium">2ª Hora: <span className="font-black text-amber-400">DJ Convidado</span></p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] p-8 border border-gray-200 dark:border-gray-700 group hover:border-blue-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Podcast Literário</p>
                <h5 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Prazeres Interrompidos</h5>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-white/5 rounded-2xl">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
            </div>
            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Os melhores livros do mundo em apenas um minuto. Quartas e Sextas em dose dupla.
            </p>
            <a 
              href="https://www.prazeresinterrompidos.pt/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              <span>Visitar Site Oficial</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
