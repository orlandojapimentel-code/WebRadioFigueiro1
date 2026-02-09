
import React, { useState, useEffect } from 'react';

interface ProgramSlot {
  time: string;
  start: number;
  end: number;
  name: string;
  host: string;
  color: string;
}

const Schedule: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const dailyPrograms: ProgramSlot[] = [
    { time: "08:00 - 10:00", start: 8, end: 10, name: "Manhãs Figueiró", host: "Música para começar o dia", color: "from-blue-500 to-cyan-500" },
    { time: "10:00 - 13:00", start: 10, end: 13, name: "Top Hits", host: "As mais pedidas do momento", color: "from-purple-500 to-indigo-600" },
    { time: "13:00 - 15:00", start: 13, end: 15, name: "Almoço Musical", host: "Sons tranquilos", color: "from-emerald-500 to-teal-600" },
    { time: "15:00 - 19:00", start: 15, end: 19, name: "Tardes em Movimento", host: "Energia para o seu regresso", color: "from-orange-500 to-rose-600" },
    { time: "19:00 - 08:00", start: 19, end: 32, name: "Noite Digital", host: "Música non-stop", color: "from-indigo-600 to-blue-800" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentProgram = (start: number, end: number) => {
    const hour = currentTime.getHours();
    if (start > end) return hour >= start || hour < end;
    return hour >= start && hour < end;
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6 md:pb-8">
        <div className="flex items-center space-x-4 md:space-x-5">
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl shadow-blue-500/20 rotate-3">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl md:text-4xl font-brand font-black text-slate-900 dark:text-white tracking-tighter">Emissão Viva</h3>
            <p className="text-[8px] md:text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] mt-1 flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Direto: {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {dailyPrograms.map((p, i) => {
          const active = isCurrentProgram(p.start, p.end);
          return (
            <div 
              key={i} 
              className={`group relative overflow-hidden rounded-[1.8rem] md:rounded-[2.5rem] transition-all duration-700 ${active ? 'p-[2px] bg-gradient-to-r ' + p.color + ' shadow-2xl scale-[1.01] md:scale-[1.02]' : 'bg-transparent border border-white/5 hover:border-white/10'}`}
            >
              <div className={`relative flex flex-col md:flex-row md:items-center justify-between p-5 md:p-8 rounded-[1.7rem] md:rounded-[2.4rem] transition-all duration-500 ${active ? 'bg-black/90 backdrop-blur-3xl' : 'bg-white/5 hover:bg-white/10'}`}>
                
                <div className="flex items-center space-x-4 md:space-x-6 flex-grow min-w-0">
                  <div className={`h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-transform group-hover:scale-110 ${active ? 'bg-gradient-to-br ' + p.color : 'bg-white/5'}`}>
                    <span className="text-white font-black text-base md:text-xl">{p.time.split(':')[0]}</span>
                  </div>
                  
                  <div className="space-y-0.5 min-w-0">
                    <h4 className={`text-lg md:text-2xl font-brand font-black tracking-tighter leading-none truncate ${active ? 'text-white' : 'text-slate-400'}`}>
                      {p.name}
                    </h4>
                    <p className={`text-[10px] md:text-sm font-medium truncate ${active ? 'text-blue-400' : 'text-slate-600 dark:text-gray-500'}`}>
                      {p.host}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-4 md:space-x-6 justify-between md:justify-end">
                   <div className="text-left md:text-right">
                     <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${active ? 'text-blue-500' : 'text-slate-500'}`}>Duração</p>
                     <p className={`text-xs md:text-sm font-mono font-black ${active ? 'text-white' : 'text-slate-400'}`}>{p.time}</p>
                   </div>
                   {active && (
                     <div className="px-3 md:px-6 py-1.5 md:py-2 rounded-full bg-white text-slate-900 text-[8px] md:text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg whitespace-nowrap">
                       No Ar
                     </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
