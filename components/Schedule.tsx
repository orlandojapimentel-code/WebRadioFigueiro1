import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Schedule: React.FC = () => {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentProgram = (start: number, end: number) => {
    const hour = currentTime.getHours();
    if (end >= 24) {
      return hour >= start || hour < end - 24;
    }
    return hour >= start && hour < end;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 block">
            {t.schedule.kicker}
          </span>
          <h3 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.schedule.title}
          </h3>
        </div>

        <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
          {t.schedule.localTime}: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-white/[0.07] glass-card overflow-hidden">
        {t.schedule.programs.map((p, i) => {
          const active = isCurrentProgram(p.start, p.end);
          return (
            <div
              key={i}
              className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 sm:px-6 sm:py-5 gap-3 transition-colors ${
                active ? 'bg-red-50/80 dark:bg-red-950/20' : ''
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs tabular-nums ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {p.time.split(':')[0]}h
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-base font-brand font-bold text-slate-900 dark:text-white truncate">
                      {p.name}
                    </h4>
                    {active && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 whitespace-nowrap shrink-0">
                        · {t.schedule.onAir}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate mt-0.5">
                    {p.host}
                  </p>
                </div>
              </div>

              <div className="sm:text-right pl-15 sm:pl-0 shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block sm:inline sm:mr-2">
                  {t.schedule.timeLabel}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {p.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Shows */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t.schedule.specialTitle}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card glass-card-interactive p-6">
            <div className="flex items-center justify-between gap-3 mb-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">
                {t.schedule.sundays}
              </span>
              <span className="tabular-nums">22:00 – 00:00</span>
            </div>
            <h5 className="text-lg font-brand font-black text-slate-900 dark:text-white mb-2">
              Night Grooves
            </h5>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {t.schedule.nightGroovesDesc}
            </p>
          </div>

          <div className="glass-card glass-card-interactive p-6">
            <div className="flex items-center justify-between gap-3 mb-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">
                {t.schedule.wedFri}
              </span>
              <span className="tabular-nums">13:00 / 20:00</span>
            </div>
            <h5 className="text-lg font-brand font-black text-slate-900 dark:text-white mb-2">
              Prazeres Interrompidos
            </h5>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {t.schedule.prazeresDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
