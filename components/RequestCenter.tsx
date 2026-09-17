
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const RequestCenter: React.FC = () => {
  const { t } = useLanguage();
  const handleWhatsApp = () => {
    const phoneNumber = "351910270085";
    const text = encodeURIComponent("Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col transition-all h-auto">
      <div className="p-6 border-b border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-red-600/20 via-rose-600/10 to-transparent">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-2xl text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <span className="text-[9px] text-red-400 font-black uppercase tracking-[0.25em] block">Interação</span>
            <h4 className="text-lg font-brand font-bold text-white tracking-tight leading-none mt-0.5">{t.request.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1">{t.request.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        <div>
          <button 
            onClick={handleWhatsApp} 
            className="w-full flex items-center justify-center space-x-2.5 bg-[#25D366] hover:bg-[#1ebd5b] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            <span>{t.request.whatsapp}</span>
          </button>
        </div>

        <div className="h-[1px] bg-white/[0.08] relative my-4">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-[#0d101a] text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {t.request.orSite}
          </span>
        </div>

        <form className="cc_request_form space-y-3.5" data-username="orlando">
          <div data-type="result" className="text-[11px] font-bold text-center py-2 text-red-400 empty:hidden"></div>
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">{t.request.artist}</label>
              <input type="text" name="request[artist]" className="w-full bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" maxLength={127} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">{t.request.song}</label>
              <input type="text" name="request[title]" className="w-full bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" maxLength={127} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">{t.request.dedication}</label>
            <input type="text" name="request[dedication]" className="w-full bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" maxLength={127} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">{t.request.name}</label>
              <input type="text" name="request[sender]" className="w-full bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" maxLength={127} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">{t.request.email}</label>
              <input type="text" name="request[email]" className="w-full bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" maxLength={127} />
            </div>
          </div>

          <button type="button" data-type="submit" className="w-full mt-3 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-red-600/20 active:scale-[0.98]">
            {t.request.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCenter;
