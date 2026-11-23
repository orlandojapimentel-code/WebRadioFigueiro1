import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const RequestCenter: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const phoneNumber = '351910270085';
    const text = encodeURIComponent('Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música.');
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const inputClass =
    'w-full bg-slate-50 dark:bg-white/[0.04] focus:bg-white dark:focus:bg-white/[0.08] border border-slate-200 dark:border-white/10 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition-colors placeholder:text-slate-400';

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-white/[0.08]">
        <span className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] block">
          {t.request.kicker}
        </span>
        <h4 className="text-lg font-brand font-bold text-slate-900 dark:text-white mt-0.5">
          {t.request.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.request.subtitle}</p>
      </div>

      <div className="p-6 space-y-5 flex-grow">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm active:scale-[0.99]"
        >
          <span>{t.request.whatsapp}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-grow bg-slate-200 dark:bg-white/[0.08]" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {t.request.orSite}
          </span>
          <div className="h-px flex-grow bg-slate-200 dark:bg-white/[0.08]" />
        </div>

        <form className="cc_request_form space-y-3" data-username="orlando">
          <div data-type="result" className="text-xs font-semibold text-center py-1 text-red-600 dark:text-red-400 empty:hidden" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                {t.request.artist}
              </label>
              <input type="text" name="request[artist]" className={inputClass} maxLength={127} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                {t.request.song}
              </label>
              <input type="text" name="request[title]" className={inputClass} maxLength={127} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
              {t.request.dedication}
            </label>
            <input type="text" name="request[dedication]" className={inputClass} maxLength={127} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                {t.request.name}
              </label>
              <input type="text" name="request[sender]" className={inputClass} maxLength={127} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                {t.request.email}
              </label>
              <input type="text" name="request[email]" className={inputClass} maxLength={127} />
            </div>
          </div>

          <button
            type="button"
            data-type="submit"
            className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm active:scale-[0.99]"
          >
            {t.request.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCenter;
