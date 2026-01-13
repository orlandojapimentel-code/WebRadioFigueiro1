
import React, { useEffect } from 'react';

const RecentTracks: React.FC = () => {
  useEffect(() => {
    // Função para carregar o script do Centova dinamicamente
    const script = document.createElement('script');
    script.src = "https://rs2.ptservidor.com:2199/system/recenttracks.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Adiciona o script ao final do body como solicitado pelo Centova
    document.body.appendChild(script);

    return () => {
      // Limpeza opcional: remove o script ao sair da página para evitar duplicação
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/20 rounded-xl text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none">Playlist</h4>
            <p className="text-[9px] text-blue-400/60 font-bold uppercase tracking-tighter mt-1">Recent Tracks</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="h-1 w-1 rounded-full bg-blue-500/40"></div>
          <div className="h-1 w-1 rounded-full bg-blue-500/60"></div>
          <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>

      <div className="max-h-[320px] overflow-y-auto scrollbar-hide pr-1 min-h-[100px]">
        {/* O Widget do Centova: exatamente como solicitado */}
        <div className="cc_recenttracks_list" data-username="orlando">
          <div className="flex flex-col items-center justify-center py-12 space-y-4 opacity-40">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Carregando ...</p>
          </div>
        </div>
      </div>
      
      <div className="pt-2 flex items-center justify-center space-x-2 border-t border-white/5 mt-2">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Atualização Automática</p>
      </div>
    </div>
  );
};

export default RecentTracks;
