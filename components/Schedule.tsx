
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
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl shadow-lg shadow-red-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] block">
              Grelha de Emissão
            </span>
            <h3 className="text-2xl sm:text-3xl font-brand font-black text-white tracking-tight mt-0.5">
              Programação 24/7
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[11px] font-mono font-bold text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Hora Local: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
        {dailyPrograms.map((p, i) => {
          const active = isCurrentProgram(p.start, p.end);
          return (
            <div 
              key={i} 
              className={`glass-card transition-all duration-300 ${active ? 'border-red-500/40 bg-red-950/10 shadow-[0_0_30px_rgba(220,38,38,0.12)]' : 'hover:border-white/15'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
                <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-mono font-bold text-sm shadow-md ${active ? 'bg-gradient-to-br from-red-600 to-rose-600 text-white' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
                    {p.time.split(':')[0]}h
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base sm:text-lg font-brand font-bold text-white tracking-tight truncate">
                        {p.name}
                      </h4>
                      {active && (
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                          No Ar
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate font-normal mt-0.5 ${active ? 'text-red-300' : 'text-slate-400'}`}>
                      {p.host}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="sm:text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Horário</span>
                    <span className="text-xs font-mono font-bold text-white">{p.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Destaques Semanais Section */}
      <div className="pt-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-px flex-grow bg-white/10"></div>
          <h3 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-[0.25em] whitespace-nowrap">
            Programas Especiais em Destaque
          </h3>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card glass-card-interactive p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg">
                Domingos
              </span>
              <span className="text-xs font-mono text-purple-300 font-bold">22:00 - 00:00</span>
            </div>
            <h4 className="text-xl font-brand font-black text-white tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
              Night Grooves
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              1ª Hora: <span className="text-white font-bold">DJ Durval</span> | 2ª Hora: <span className="text-white font-bold">DJ Convidado</span>. O melhor da música eletrónica e soulful grooves.
            </p>
          </div>

          <div className="glass-card glass-card-interactive p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-lg">
                Quartas & Sextas
              </span>
              <span className="text-xs font-mono text-pink-300 font-bold">13:00 / 20:00</span>
            </div>
            <h4 className="text-xl font-brand font-black text-white tracking-tight mb-2 group-hover:text-pink-300 transition-colors">
              Prazeres Interrompidos
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Crónicas, literatura e música seleta. Emissão às 13:00 com repetição às <span className="text-white font-bold">20:00</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
