
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
    <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl overflow-hidden flex flex-col transition-all h-auto min-h-[550px]">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
          </div>
          <div>
            <h4 className="text-xl font-black uppercase tracking-tighter leading-none">{t.request.title}</h4>
            <p className="text-[9px] text-blue-200 font-bold uppercase tracking-[0.2em] mt-1.5">{t.request.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-grow">
        <div className="space-y-3">
          <button onClick={handleWhatsApp} className="w-full flex items-center justify-center space-x-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
            <span>{t.request.whatsapp}</span>
          </button>
        </div>

        <div className="h-[1px] bg-slate-100 dark:bg-white/5 relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white dark:bg-[#0f172a] text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.request.orSite}</span>
        </div>

        <form className="cc_request_form space-y-4" data-username="orlando">
           <div data-type="result" className="text-[10px] font-bold text-center py-2 text-blue-600 dark:text-blue-400 empty:hidden"></div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{t.request.artist}</label>
               <input type="text" name="request[artist]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white" maxLength={127} />
             </div>
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{t.request.song}</label>
               <input type="text" name="request[title]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white" maxLength={127} />
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{t.request.dedication}</label>
             <input type="text" name="request[dedication]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white" maxLength={127} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{t.request.name}</label>
               <input type="text" name="request[sender]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white" maxLength={127} />
             </div>
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{t.request.email}</label>
               <input type="text" name="request[email]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white" maxLength={127} />
             </div>
           </div>

           <button type="button" data-type="submit" className="w-full mt-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98]">
             {t.request.submit}
           </button>
        </form>
      </div>

      <div className="p-5 bg-slate-50 dark:bg-black/20 text-center border-t border-slate-100 dark:border-white/5">
        <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.4em]">Web Rádio Figueiró • 2026</p>
      </div>
    </div>
  );
};

export default RequestCenter;
