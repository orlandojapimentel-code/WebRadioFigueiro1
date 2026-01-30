
import React from 'react';

const GeminiAssistant: React.FC = () => {
  const handleWhatsApp = () => {
    const phoneNumber = "351910270085";
    const text = encodeURIComponent("Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música e uma dedicatória.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl overflow-hidden flex flex-col transition-all">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-2xl shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <div>
            <h4 className="font-black text-lg uppercase tracking-widest leading-none">Pedidos WRF</h4>
            <p className="text-[9px] opacity-70 font-bold uppercase tracking-[0.2em] mt-1.5">Sintonize a Sua Música</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-black/20 rounded-lg border border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest">Online</span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="text-center space-y-2 mb-2">
          <h5 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">Peça a sua música favorita!</h5>
          <p className="text-slate-500 dark:text-gray-400 text-xs">A nossa equipa está pronta para ouvir o seu pedido e enviar uma dedicatória especial.</p>
        </div>

        <button 
          onClick={handleWhatsApp} 
          className="w-full group flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-green-600/20 active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>Dedicatória via WhatsApp</span>
        </button>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-white/5"></div></div>
          <span className="relative px-4 bg-white dark:bg-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ou use o formulário</span>
        </div>

        <form className="cc_request_form space-y-4" data-username="orlando">
           <div className="space-y-4">
             <div className="relative group">
               <input type="text" name="request[artist]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="Nome do Artista" />
             </div>
             <div className="relative group">
               <input type="text" name="request[title]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="Título da Música" />
             </div>
             <div className="relative group">
               <input type="text" name="request[sender]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="Seu Nome / Dedicatória" />
             </div>
           </div>
           <button type="button" data-type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 mt-4">
             Enviar Pedido
           </button>
        </form>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-black/20 text-center border-t border-gray-100 dark:border-white/5">
        <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.4em] italic leading-none">Web Rádio Figueiró • 2026</p>
      </div>
    </div>
  );
};

export default GeminiAssistant;
