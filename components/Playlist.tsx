
import React from 'react';

const Playlist: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl backdrop-blur-xl">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
        <div className="p-2.5 bg-red-600/10 rounded-xl text-red-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">Playlist</h4>
          <p className="text-[9px] text-red-600 font-bold uppercase tracking-tighter mt-1">Recentemente Tocadas</p>
        </div>
      </div>

      <div className="centova-playlist-container overflow-hidden">
        {/* Widget Centova Cast */}
        <div className="cc_recenttracks_list" data-username="orlando">
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sintonizando histórico...</p>
          </div>
        </div>
      </div>

      <style>{`
        /* Estilização para o Widget do Centova */
        .cc_recenttracks_list {
          font-family: inherit;
          color: inherit;
        }
        .cc_recenttracks_list table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }
        .cc_recenttracks_list td {
          padding: 0;
          vertical-align: middle;
        }
        .cc_recenttracks_list .cc_recenttracks_row {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cc_recenttracks_list .cc_recenttracks_title {
          font-size: 0.75rem;
          font-weight: 800;
          color: #ef4444;
          display: block;
          margin-bottom: 2px;
        }
        .cc_recenttracks_list .cc_recenttracks_artist {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          display: block;
        }
        .dark .cc_recenttracks_list .cc_recenttracks_artist {
          color: #94a3b8;
        }
        .cc_recenttracks_list .cc_recenttracks_time {
          font-size: 0.6rem;
          font-weight: 900;
          color: #64748b;
          text-transform: uppercase;
          margin-top: 4px;
        }
        /* Esconder elementos desnecessários se o widget injetar tabelas */
        .cc_recenttracks_list table tr {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default Playlist;
