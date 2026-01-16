
import React from 'react';

const RequestCenter: React.FC = () => {
  const handleWhatsApp = () => {
    const phoneNumber = "351910270085";
    const text = encodeURIComponent("Olá Web Rádio Figueiró! Gostaria de fazer um pedido de música.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl overflow-hidden flex flex-col transition-all">
      
      {/* Header do Componente */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest">Centro de Pedidos</h4>
            <p className="text-[9px] opacity-70 font-bold uppercase tracking-tighter">Fale connosco em direto</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Botão WhatsApp */}
        <button 
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>Mensagem WhatsApp</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white dark:bg-gray-800 px-4 text-gray-400">ou via formulário</span></div>
        </div>

        {/* Formulário Oficial Centova */}
        <form className="cc_request_form space-y-4" data-username="orlando">
          <div data-type="result" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-2 empty:hidden bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-center"></div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Artista</label>
                <input type="text" name="request[artist]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white" placeholder="Nome do cantor/banda" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Música</label>
                <input type="text" name="request[title]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white" placeholder="Título da canção" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Dedicatória</label>
              <input type="text" name="request[dedication]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white" placeholder="Para quem é a música?" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">O seu nome</label>
                <input type="text" name="request[sender]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white" placeholder="Identifique-se" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">E-mail</label>
                <input type="text" name="request[email]" className="w-full bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white" placeholder="Para contacto" />
              </div>
            </div>
          </div>

          <button 
            type="button" 
            data-type="submit"
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:text-white active:scale-95 shadow-lg"
          >
            Submeter Pedido
          </button>
        </form>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 text-center">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">A música certa no momento certo.</p>
      </div>
    </div>
  );
};

export default RequestCenter;
