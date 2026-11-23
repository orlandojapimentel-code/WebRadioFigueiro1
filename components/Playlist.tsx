import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Playlist: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-white/[0.08] pb-3.5">
        <div>
          <span className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] block">
            {t.hero.originValue}
          </span>
          <h4 className="text-base font-brand font-bold text-slate-900 dark:text-white mt-0.5">
            {t.media.tabs.playlist === 'Playlist (15)' ? 'Músicas Recentes' : 'Recent Tracks'}
          </h4>
        </div>
      </div>

      <div className="centova-playlist-container overflow-hidden">
        <div className="cc_recenttracks_list" data-username="orlando">
          <div className="flex flex-col items-center justify-center py-8 space-y-2.5">
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.player.tuning}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .cc_recenttracks_list {
          font-family: inherit;
          color: inherit;
        }
        .cc_recenttracks_list table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .cc_recenttracks_list td {
          padding: 0;
          vertical-align: middle;
        }
        .cc_recenttracks_list .cc_recenttracks_row {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
          padding: 0.65rem 0.85rem;
          background: rgba(241, 245, 249, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 0.75rem;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .dark .cc_recenttracks_list .cc_recenttracks_row {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.07);
        }
        .cc_recenttracks_list .cc_recenttracks_row:hover {
          border-color: rgba(220, 38, 38, 0.35);
        }
        .cc_recenttracks_list .cc_recenttracks_title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
          display: block;
          margin-bottom: 2px;
        }
        .dark .cc_recenttracks_list .cc_recenttracks_title {
          color: #ffffff;
        }
        .cc_recenttracks_list .cc_recenttracks_artist {
          font-size: 0.72rem;
          font-weight: 500;
          color: #475569;
          display: block;
        }
        .dark .cc_recenttracks_list .cc_recenttracks_artist {
          color: #94a3b8;
        }
        .cc_recenttracks_list .cc_recenttracks_time {
          font-size: 0.68rem;
          font-weight: 700;
          color: #dc2626;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .dark .cc_recenttracks_list .cc_recenttracks_time {
          color: #f87171;
        }
        .cc_recenttracks_list table tr {
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default Playlist;
