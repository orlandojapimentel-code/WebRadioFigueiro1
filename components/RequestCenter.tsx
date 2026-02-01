
import React from 'react';

const RequestCenter: React.FC = () => {
  const handleWhatsApp = () => {
    const phoneNumber = "351910270085";
    const text = encodeURIComponent("Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl overflow-hidden flex flex-col transition-all h-auto min-h-[550px]">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Peça a sua Música</h4>
            <p className="text-[9px] text-blue-200 font-bold uppercase tracking-[0.2em] mt-1.5">O seu som na WRF Digital</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-grow">
        {/* Opção WhatsApp */}
        <div className="space-y-3">
          <p className="text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Via Mensagem Direta</p>
          <button 
            onClick={handleWhatsApp} 
            className="w-full group flex items-center justify-center space-x-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-green-600/20 active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>Pedir via WhatsApp</span>
          </button>
        </div>

        <div className="h-[1px] bg-slate-100 dark:bg-white/5 relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white dark:bg-[#0f172a] text-[9px] font-black text-slate-400 uppercase tracking-widest">Ou pelo Site</span>
        </div>

        {/* Formulário Completo Centova */}
        <form className="cc_request_form space-y-4" data-username="orlando">
           <div data-type="result" className="text-[10px] font-bold text-center py-2 text-blue-600 dark:text-blue-400 empty:hidden bg-blue-50 dark:bg-blue-600/10 rounded-xl border border-blue-100 dark:border-blue-500/20 mb-4 animate-in fade-in zoom-in"></div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Artista / Cantor</label>
               <input type="text" name="request[artist]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white outline-none focus:border-blue-500/50 transition-all" placeholder="Nome do Artista" maxLength={127} />
             </div>
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Título da Música</label>
               <input type="text" name="request[title]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white outline-none focus:border-blue-500/50 transition-all" placeholder="Nome do Som" maxLength={127} />
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Dedicatória (Para quem?)</label>
             <input type="text" name="request[dedication]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white outline-none focus:border-blue-500/50 transition-all" placeholder="Ex: Para a minha família em Amarante" maxLength={127} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">O Seu Nome</label>
               <input type="text" name="request[sender]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white outline-none focus:border-blue-500/50 transition-all" placeholder="Identifique-se" maxLength={127} />
             </div>
             <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">O Seu E-Mail</label>
               <input type="text" name="request[email]" className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3 text-xs dark:text-white outline-none focus:border-blue-500/50 transition-all" placeholder="exemplo@mail.com" maxLength={127} />
             </div>
           </div>

           <button 
            type="button" 
            data-type="submit" 
            className="w-full mt-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] border border-white/5"
           >
             Submeter Pedido
           </button>
        </form>
      </div>

      <div className="p-5 bg-slate-50 dark:bg-black/20 text-center border-t border-slate-100 dark:border-white/5 shrink-0">
        <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.4em]">Web Rádio Figueiró • Centro de Pedidos 2026</p>
      </div>
    </div>
  );
};

export default RequestCenter;
