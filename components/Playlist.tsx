
import React from 'react';

const Playlist: React.FC = () => {
  return (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-5 border-b border-white/[0.08] pb-4">
        <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div>
          <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.25em] block">Histórico</span>
          <h4 className="text-sm font-brand font-bold text-white tracking-tight leading-none mt-0.5">Músicas Recentes</h4>
        </div>
      </div>

      <div className="centova-playlist-container overflow-hidden">
        {/* Widget Centova Cast */}
        <div className="cc_recenttracks_list" data-username="orlando">
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
          border-spacing: 0 10px;
        }
        .cc_recenttracks_list td {
          padding: 0;
          vertical-align: middle;
        }
        .cc_recenttracks_list .cc_recenttracks_row {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.75rem;
          padding: 0.65rem 0.85rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          transition: all 0.2s ease;
        }
        .cc_recenttracks_list .cc_recenttracks_row:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(220, 38, 38, 0.3);
        }
        .cc_recenttracks_list .cc_recenttracks_title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          display: block;
          margin-bottom: 2px;
        }
        .cc_recenttracks_list .cc_recenttracks_artist {
          font-size: 0.7rem;
          font-weight: 600;
          color: #94a3b8;
          display: block;
        }
        .cc_recenttracks_list .cc_recenttracks_time {
          font-size: 0.65rem;
          font-weight: 800;
          color: #ef4444;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .cc_recenttracks_list table tr {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default Playlist;
